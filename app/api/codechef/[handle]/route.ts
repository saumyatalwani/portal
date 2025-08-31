import { NextResponse } from "next/server";
import { fetchProfile } from "@/lib/codechef";

export async function GET(
  req: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = params;

  if (!handle || handle === "favicon.ico") {
    return NextResponse.json(
      { success: false, error: "invalid handle" },
      { status: 400 }
    );
  }

  const result = await fetchProfile(handle);
  return NextResponse.json(result);
}