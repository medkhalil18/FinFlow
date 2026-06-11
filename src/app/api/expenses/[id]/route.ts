import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { expenses, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the expense first to restore allocation
    const [expense] = await db.select()
      .from(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .limit(1);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await db.delete(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId)));

    // Restore allocation
    const [user] = await db.select({
      allocationExpense: users.allocationExpense,
    }).from(users).where(eq(users.id, userId)).limit(1);

    const currentExpense = parseFloat(user.allocationExpense || "0");
    await db.update(users).set({
      allocationExpense: String(currentExpense + parseFloat(expense.amount)),
    }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
