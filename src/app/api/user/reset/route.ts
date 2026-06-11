import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function POST() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(expenses).where(eq(expenses.userId, userId));

    await db.update(users).set({
      monthlyIncome: "0",
      existingLiability: "0",
      allocationLiability: "0",
      allocationInvest: "0",
      allocationExpense: "0",
      isSetup: "false",
    }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset all error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
