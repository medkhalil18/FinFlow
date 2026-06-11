import { getCurrentUserId } from "@/lib/auth";
import { db } from "@/db";
import { users, expenses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AuthScreen } from "@/components/AuthScreen";
import { AppShell } from "@/components/AppShell";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return <AuthScreen />;
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      monthlyIncome: users.monthlyIncome,
      existingLiability: users.existingLiability,
      allocationLiability: users.allocationLiability,
      allocationInvest: users.allocationInvest,
      allocationExpense: users.allocationExpense,
      isSetup: users.isSetup,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return <AuthScreen />;
  }

  const userExpenses = await db
    .select({
      id: expenses.id,
      date: expenses.date,
      category: expenses.category,
      amount: expenses.amount,
      note: expenses.note,
    })
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date), desc(expenses.createdAt));

  const profile = {
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
  };

  const formattedExpenses = userExpenses.map((e) => ({
    id: e.id,
    date: e.date,
    category: e.category,
    amount: parseFloat(e.amount),
    note: e.note || undefined,
  }));

  return <AppShell initialProfile={profile} initialExpenses={formattedExpenses} />;
}
