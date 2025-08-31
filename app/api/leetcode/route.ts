import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const url = "https://leetcode.com/graphql";

interface Profile {
  ranking: number;
  reputation: number;
  starRating: number;
}

interface ContestBadge {
  name: string;
  icon: string;
}

interface UserData {
  username: string;
  profile: Profile;
  contestBadge: ContestBadge | null;
}

type BatchResponse = Record<string, UserData | null>;

interface GraphQLError {
  message: string;
  path?: string[];
}

interface GraphQLResponse {
  data?: BatchResponse;
  errors?: GraphQLError[];
}

// --- Build query ---
function buildQuery(usernames: string[]) {
  let query = "query getProfiles {";
  usernames.forEach((u) => {
    query += `
      ${u.replace(/[^a-zA-Z0-9_]/g, "_")}: matchedUser(username: "${u}") {
        username
        profile {
          ranking
          reputation
          starRating
        }
        contestBadge {
          name
          icon
        }
      }`;
  });
  query += "}";
  return query;
}

async function fetchProfiles(usernames: string[]): Promise<BatchResponse> {
  const query = buildQuery(usernames);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const result: GraphQLResponse = await response.json();

  const data: BatchResponse = result.data || {};

  if (result.errors) {
    result.errors.forEach((err) => {
      if (
        err.message.includes("That user does not exist.") &&
        Array.isArray(err.path)
      ) {
        const alias = err.path[0];
        data[alias] = null;
      } else {
        console.error("GraphQL Error:", err.message);
      }
    });
  }

  return data;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit = 5
): Promise<T[]> {
  const results: Promise<T>[] = [];
  const executing: Promise<any>[] = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);

    if (limit <= tasks.length) {
      let e: Promise<any>;
      e = p.then(() => {
        const idx = executing.indexOf(e);
        if (idx > -1) executing.splice(idx, 1);
      });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

async function fetchProfilesBatch(
  usernames: string[],
  batchSize = 20,
  concurrency = 5
): Promise<BatchResponse> {
  const chunks = chunkArray(usernames, batchSize);
  const tasks = chunks.map((chunk) => async () => fetchProfiles(chunk));
  const batchResults = await runWithConcurrency(tasks, concurrency);
  return Object.assign({}, ...batchResults);
}

export async function GET(req: Request) {
  const headers = req.headers;
  const apiKey = headers.get("x-api-key");

  if (apiKey) {
    const verified = await auth.api.verifyApiKey({
      body: {
        key: apiKey,
        permissions: { leetcode: ["read"] },
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
    select: { rollNo: true, lc_id: true },
  });

  if (!list || list.length === 0) {
    return NextResponse.json(
      { success: false, error: "no handles in db" },
      { status: 400 }
    );
  }

  const handles = list.map((h: any) => h.lc_id?.trim()).filter(Boolean);

  try {
    const data = await fetchProfilesBatch(handles, 20, 5);

    // --- 🔄 Map BatchResponse into updates ---
    const updates = Object.entries(data)
      .filter(([_, user]) => user !== null) // skip invalid handles
      .map(([alias, user]) =>
        prisma.student.update({
          where: { lc_id: user!.username },
          data: {
            lc_ranking: user!.profile.ranking,
            lc_star_rating: user!.profile.starRating,
            lc_badge: user!.contestBadge?.name ?? null,
          },
        })
      );

    // Run in transaction
    if (updates.length > 0) {
      await prisma.$transaction([
        ...updates,
        prisma.logs.create({
          data: {
            type: "SUCCESS",
            msg: "LEETCODE DATA UPDATED",
          },
        }),
      ]);
    } else {
      await prisma.logs.create({
        data: {
          type: "ERROR",
          msg: "LEETCODE DATA FETCHED, BUT NO VALID USERS",
        },
      });
    }

    return NextResponse.json({ code: 200, message: "UPDATE SUCCESS" });
  } catch (err: any) {
    console.error("Error fetching LeetCode data:", err);

    await prisma.logs.create({
      data: {
        type: "ERROR",
        msg: `LEETCODE UPDATE FAILED: ${err.message || String(err)}`,
      },
    });

    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles", details: err.message },
      { status: 500 }
    );
  }
}
