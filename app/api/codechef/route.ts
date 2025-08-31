import { NextResponse } from "next/server";
import { fetchProfile, type ProfileResult } from "@/lib/codechef";
import pLimit from "p-limit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const limit = pLimit(5);

async function fetchProfiles(handles: string[]): Promise<ProfileResult[]> {
  const tasks = handles.map((h) => limit(() => fetchProfile(h)));
  return Promise.all(tasks);
}

export async function GET(req: Request) {
  const headers = req.headers;
    const apiKey = headers.get("x-api-key");
  
    if (apiKey) {
      const verified = await auth.api.verifyApiKey({
        body: {
          key: apiKey,
          permissions: { codechef: ["read"] },
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
  

    const list = await prisma.student.findMany({
      select : {
        rollNo : true,
        cc_id : true
      }
    })

  if (!list) {
    return NextResponse.json(
      {
        success: false,
        error: "no handles in db",
      },
      { status: 400 }
    );
  }

  const handles: string[] = list
    .map((h:any) => h.cc_id.trim())
    .filter(Boolean);

  try {
    const results: ProfileResult[] = await fetchProfiles(handles);

    const updates = results.map((r: any) => ({
      where: { cc_id: r.handle },
      data: {
        cc_current_rating: r.currentRating,
        cc_max_rating: r.highestRating,
        cc_star_rating: r.stars,
      },
    }));

    await prisma.$transaction([
      ...updates.map((u) => prisma.student.update(u)),
      prisma.logs.create({
        data: {
          type: "SUCCESS",
          msg: "CODECHEF DATA UPDATED",
        },
      }),
    ]);

    return NextResponse.json({ code: 200, message: "UPDATE SUCCESS" });
  } catch (err: any) {
    console.error("Error updating CodeChef data:", err);

    await prisma.logs.create({
      data: {
        type: "ERROR",
        msg: `CODECHEF DATA UPDATE FAILED: ${err.message || String(err)}`,
      },
    });

    return NextResponse.json(
      { success: false, error: "UPDATE FAILED" },
      { status: 500 }
    );
  }
}
