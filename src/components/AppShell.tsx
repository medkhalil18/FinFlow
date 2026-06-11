"use client";

import { useState, useCallback, useMemo } from "react";
import { Menu, Wallet } from "lucide-react";
import type { UserProfile, Expense, Page, Allocation } from "@/lib/types";
import { SetupScreen } from "./SetupScreen";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { AddExpense } from "./AddExpense";
import { ExpensesList } from "./ExpensesList";
import { Analytics } from "./Analytics";
import { Projections } from "./Projections";
import { Settings } from "./Settings";

interface AppShellProps {
  initialProfile: UserProfile;
  initialExpenses: Expense[];
}

export function AppShell({ initialProfile, initialExpenses }: AppShellProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [expensesList, setExpensesList] = useState<Expense[]>(initialExpenses);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const completeSetup = useCallback(
    async (income: number, existingLiability: number) => {
      const liability = income / 3;
      const invest = income / 3;
      const expense = income / 3;

      let adjLiability = liability;
      let adjExpense = expense;
      const adjInvest = invest;

      if (existingLiability < liability) {
        adjLiability = liability;
      } else {
        adjLiability = liability;
        const excess = existingLiability - liability;
        adjExpense = excess > adjExpense ? 0 : adjExpense - excess;
      }

      const allocation = { liability: adjLiability, invest: adjInvest, expense: adjExpense };
      const newProfile = {
        ...profile,
        monthlyIncome: income,
        existingLiability,
        allocation,
        isSetup: true,
      };

      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });

      setProfile(newProfile);
    },
    [profile]
  );

  const addExpense = useCallback(
    async (expense: { date: string; category: string; amount: number; note?: string }) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      });
      const newExpense = await res.json();
      if (res.ok) {
        setExpensesList((prev) => [newExpense, ...prev]);
        setProfile((prev) => ({
          ...prev,
          allocation: {
            ...prev.allocation,
            expense: Math.max(0, prev.allocation.expense - expense.amount),
          },
        }));
      }
      return res.ok;
    },
    []
  );

  const deleteExpense = useCallback(async (id: string) => {
    const expense = expensesList.find((e) => e.id === id);
    if (!expense) return;

    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExpensesList((prev) => prev.filter((e) => e.id !== id));
      setProfile((prev) => ({
        ...prev,
        allocation: {
          ...prev.allocation,
          expense: prev.allocation.expense + expense.amount,
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expensesList]);

  const resetExpenses = useCallback(async () => {
    const res = await fetch("/api/expenses/reset", { method: "POST" });
    if (res.ok) {
      setExpensesList([]);
      setProfile((prev) => ({
        ...prev,
        allocation: {
          ...prev.allocation,
          expense: prev.monthlyIncome / 3,
        },
      }));
    }
  }, []);

  const resetAll = useCallback(async () => {
    const res = await fetch("/api/user/reset", { method: "POST" });
    if (res.ok) {
      setExpensesList([]);
      setProfile((prev) => ({
        ...prev,
        monthlyIncome: 0,
        existingLiability: 0,
        allocation: { liability: 0, invest: 0, expense: 0 },
        isSetup: false,
      }));
      setCurrentPage("dashboard");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }, []);

  const totalSpending = useMemo(
    () => expensesList.reduce((sum, e) => sum + e.amount, 0),
    [expensesList]
  );

  const categorySpending = useMemo(() => {
    const result: Record<string, number> = {};
    expensesList.forEach((e) => {
      result[e.category] = (result[e.category] || 0) + e.amount;
    });
    return result;
  }, [expensesList]);

  const originalAllocation: Allocation = useMemo(
    () => ({
      liability: profile.monthlyIncome / 3,
      invest: profile.monthlyIncome / 3,
      expense: profile.monthlyIncome / 3,
    }),
    [profile.monthlyIncome]
  );

  const uniqueMonths = useMemo(
    () => new Set(expensesList.map((e) => e.date.substring(0, 7))).size,
    [expensesList]
  );

  if (!profile.isSetup) {
    return <SetupScreen onComplete={completeSetup} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            profile={profile}
            expenses={expensesList}
            totalSpending={totalSpending}
            categorySpending={categorySpending}
            originalAllocation={originalAllocation}
            onNavigate={setCurrentPage}
          />
        );
      case "add-expense":
        return <AddExpense remaining={profile.allocation.expense} onAdd={addExpense} />;
      case "expenses":
        return <ExpensesList expenses={expensesList} onDelete={deleteExpense} />;
      case "analytics":
        return (
          <Analytics
            expenses={expensesList}
            categorySpending={categorySpending}
            totalSpending={totalSpending}
            monthlyIncome={profile.monthlyIncome}
          />
        );
      case "projections":
        return (
          <Projections
            monthlyIncome={profile.monthlyIncome}
            allocation={profile.allocation}
            totalSpending={totalSpending}
            uniqueMonths={uniqueMonths}
          />
        );
      case "settings":
        return (
          <Settings
            profile={profile}
            totalExpenses={totalSpending}
            expenseCount={expensesList.length}
            onResetExpenses={resetExpenses}
            onResetAll={resetAll}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center px-4 z-30 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <Wallet className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-white">FinFlow</span>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page: Page) => {
          setCurrentPage(page);
          setSidebarOpen(false);
        }}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onResetAll={resetAll}
        email={profile.email}
        monthlyIncome={profile.monthlyIncome}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pt-14 lg:pt-0 lg:ml-72">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{renderPage()}</div>
      </div>
    </div>
  );
}
