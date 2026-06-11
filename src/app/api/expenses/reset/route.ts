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

    // Restore allocation to original 1/3
    const [user] = await db.select({
      monthlyIncome: users.monthlyIncome,
    }).from(users).where(eq(users.id, userId)).limit(1);

    const income = parseFloat(user.monthlyIncome || "0");
    await db.update(users).set({
      allocationExpense: String(income / 3),
    }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset expenses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
