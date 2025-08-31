import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const headers = req.headers;
  
  const session = await auth.api.getSession({ headers });
  if (!session) {return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });}
  
  const list = await prisma.logs.findMany();
  const serialized = list.map((log : any) => ({
    ...log,
    id: log.id.toString(),
  }));
  return NextResponse.json({ data : serialized },{ status: 200 });
}