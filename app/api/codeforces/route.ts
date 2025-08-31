import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// helper to chunk array into batches of size n
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export async function GET(req: Request) {
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");

  try {
    // --- 🔐 AUTH ---
    if (apiKey) {
      const verified = await auth.api.verifyApiKey({
        body: {
          key: apiKey,
          permissions: { codeforces: ["read"] },
        },
      });
      if (!verified.valid) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    } else {
      const session = await auth.api.getSession({ headers });
      if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    // --- 📦 FETCH HANDLES FROM DB ---
    const list = await prisma.student.findMany({
      select: { rollNo: true, cf_id: true },
    });

    if (!list || list.length === 0) {
      return NextResponse.json(
        { success: false, error: "no handles in db" },
        { status: 400 }
      );
    }

    const handles: string[] = list.map((h: any) => h.cf_id?.trim()).filter(Boolean);

    // --- 🌍 FETCH CF PROFILES IN BATCHES ---
    const results: any[] = [];
    const errors: string[] = [];

    const batches = chunk(handles, 10);

    for (const batch of batches) {
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.info?handles=${batch.join(";")}`
        );
        const data = await res.json();

        if (data.status === "OK") {
          results.push(...data.result);
        } else {
          // ❌ batch failed → retry each individually
          for (const handle of batch) {
            try {
              const r = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
              const d = await r.json();

              if (d.status === "OK") {
                results.push(d.result[0]);
              } else {
                errors.push(`Handle ${handle} failed: ${d.comment}`);
              }
            } catch (err: any) {
              errors.push(`Handle ${handle} failed: ${err.message}`);
            }
          }
        }
      } catch (err: any) {
        errors.push(`Batch [${batch.join(", ")}] failed: ${err.message}`);
      }
    }

    if (errors.length > 0) {
      await prisma.logs.create({
        data: {
          type: "ERROR",
          msg: `Some Codeforces handles failed: ${errors.join("; ")}`,
        },
      });
    }
      
    const updates = results.map((r: any) => ({
      where: { cf_id: r.handle },
      data: {
        cf_rating: r.rating,
        cf_max_rating: r.maxRating,
        cf_rank: r.rank,
        cf_max_rank : r.maxRank
      },
    }));

    await prisma.$transaction([
      ...updates.map((u) => prisma.student.update(u)),
      prisma.logs.create({
        data: {
          type: "SUCCESS",
          msg: "CODEFORCES DATA UPDATED",
        },
      }),
    ]);

   return NextResponse.json({ code: 200, message: "UPDATE SUCCESS" });
  } catch (err: any) {
    console.error("Unexpected error", err);

    await prisma.logs.create({
      data: {
        type: "ERROR",
        msg: `UNEXPECTED ERROR: ${err.message || String(err)}`,
      },
    });

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}