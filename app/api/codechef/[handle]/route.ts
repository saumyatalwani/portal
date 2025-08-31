import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchProfile } from "@/lib/codechef";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { handle } = context.params;

  if (!handle || handle === "favicon.ico") {
    return NextResponse.json(
      { success: false, error: "invalid handle" },
      { status: 400 }
    );
  }

  const result = await fetchProfile(handle);
  return NextResponse.json(result);
}