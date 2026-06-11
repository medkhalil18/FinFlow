import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select({
      id: users.id,
      email: users.email,
      monthlyIncome: users.monthlyIncome,
      existingLiability: users.existingLiability,
      allocationLiability: users.allocationLiability,
      allocationInvest: users.allocationInvest,
      allocationExpense: users.allocationExpense,
      isSetup: users.isSetup,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      monthlyIncome: parseFloat(user.monthlyIncome || "0"),
      existingLiability: parseFloat(user.existingLiability || "0"),
      allocation: {
        liability: parseFloat(user.allocationLiability || "0"),
        invest: parseFloat(user.allocationInvest || "0"),
        expense: parseFloat(user.allocationExpense || "0"),
      },
      isSetup: user.isSetup === "true",
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { monthlyIncome, existingLiability, allocation, isSetup } = body;

    await db.update(users).set({
      monthlyIncome: String(monthlyIncome),
      existingLiability: String(existingLiability),
      allocationLiability: String(allocation.liability),
      allocationInvest: String(allocation.invest),
      allocationExpense: String(allocation.expense),
      isSetup: isSetup ? "true" : "false",
    }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
