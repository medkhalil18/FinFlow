import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("finflow_token", "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });

  return res;
}
