import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createToken, getSessionCookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await db.insert(users).values({
      email: email.toLowerCase(),
      passwordHash,
    }).returning({ id: users.id });

    if (!user) {
      throw new Error("User insert returned no id");
    }

    const token = await createToken(user.id);
    const res = NextResponse.json({ success: true, userId: user.id });
    res.cookies.set("finflow_token", token, getSessionCookieOptions());
    return res;

  } catch (error: any) {
    console.error("Signup error:", error);
    // Return the real error message in non-production to debug faster
    const message = process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error?.message || String(error);
    return NextResponse.json({ error: message, stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined }, { status: 500 });
  }
}
