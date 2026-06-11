import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { expenses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.select({
      id: expenses.id,
      date: expenses.date,
      category: expenses.category,
      amount: expenses.amount,
      note: expenses.note,
    }).from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date), desc(expenses.createdAt));

    const formatted = result.map(e => ({
      ...e,
      amount: parseFloat(e.amount),
      note: e.note || undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, category, amount, note } = await req.json();

    if (!date || !category || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [expense] = await db.insert(expenses).values({
      userId,
      date,
      category,
      amount: String(amount),
      note: note || null,
    }).returning();

    // Update user allocation
    const [user] = await db.select({
      allocationExpense: users.allocationExpense,
    }).from(users).where(eq(users.id, userId)).limit(1);

    const currentExpense = parseFloat(user.allocationExpense || "0");
    await db.update(users).set({
      allocationExpense: String(Math.max(0, currentExpense - amount)),
    }).where(eq(users.id, userId));

    return NextResponse.json({
      id: expense.id,
      date: expense.date,
      category: expense.category,
      amount: parseFloat(expense.amount),
      note: expense.note || undefined,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
