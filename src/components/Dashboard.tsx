"use client";

import { useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, Wallet, PiggyBank, CreditCard,
  Plus, Receipt, ChevronDown, ChevronUp, Calendar, Sparkles,
  Target, Shield, TrendingUp, BarChart3,
} from "lucide-react";
import type { Expense, Allocation, UserProfile, Page } from "@/lib/types";

interface DashboardProps {
  profile: UserProfile;
  expenses: Expense[];
  totalSpending: number;
  categorySpending: Record<string, number>;
  originalAllocation: Allocation;
  onNavigate: (page: Page) => void;
}

export function Dashboard({ profile, expenses, totalSpending, categorySpending, originalAllocation, onNavigate }: DashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const format = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const spentPercent = profile.allocation.expense > 0
    ? ((totalSpending / (totalSpending + profile.allocation.expense)) * 100).toFixed(1)
    : totalSpending > 0 ? "100.0" : "0.0";

  const recentExpenses = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const topCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const allocCards = [
    {
      title: "Liability",
      amount: profile.allocation.liability,
      original: originalAllocation.liability,
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/20",
    },
    {
      title: "Investment",
      amount: profile.allocation.invest,
      original: originalAllocation.invest,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      title: "Expenses",
      amount: profile.allocation.expense,
      original: originalAllocation.expense,
      icon: CreditCard,
      color: "from-indigo-500 to-violet-600",
      shadowColor: "shadow-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Your financial overview at a glance</p>
        </div>
        <button
          onClick={() => onNavigate("add-expense")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Income + Spending cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm text-indigo-300">Income</span>
          </div>
          <p className="text-xl font-bold text-white">{format(profile.monthlyIncome)}</p>
          <p className="text-xs text-slate-500 mt-1">Monthly</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-sm text-rose-300">Spent</span>
          </div>
          <p className="text-xl font-bold text-white">{format(totalSpending)}</p>
          <p className="text-xs text-slate-500 mt-1">{spentPercent}% of expenses</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm text-emerald-300">Remaining</span>
          </div>
          <p className="text-xl font-bold text-white">{format(profile.allocation.expense)}</p>
          <p className="text-xs text-slate-500 mt-1">Pocket money</p>
        </div>

        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-violet-300">Invest</span>
          </div>
          <p className="text-xl font-bold text-white">{format(profile.allocation.invest)}</p>
          <p className="text-xs text-slate-500 mt-1">Monthly</p>
        </div>
      </div>

      {/* Allocation breakdown */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="flex h-3">
          {(() => {
            return (
              <>
                <div className="bg-amber-500 transition-all duration-500" style={{ width: `${profile.monthlyIncome > 0 ? (originalAllocation.liability / profile.monthlyIncome) * 100 : 0}%` }} title={`Liability: ${format(originalAllocation.liability)}`} />
                <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${profile.monthlyIncome > 0 ? (originalAllocation.invest / profile.monthlyIncome) * 100 : 0}%` }} title={`Investment: ${format(originalAllocation.invest)}`} />
                <div className="bg-indigo-500 transition-all duration-500" style={{ width: `${profile.monthlyIncome > 0 ? (originalAllocation.expense / profile.monthlyIncome) * 100 : 0}%` }} title={`Expenses: ${format(originalAllocation.expense)}`} />
              </>
            );
          })()}
        </div>
        <div className="p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Allocation Breakdown</h3>
          <div className="space-y-3">
            {allocCards.map(({ title, amount, original, icon: Icon, color, shadowColor }) => (
              <div key={title} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} ${shadowColor} shadow-sm flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-slate-500">
                      {amount !== original && `${format(amount)} remaining of ${format(original)}`}
                      {amount === original && `Allocated: ${format(original)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{format(amount)}</p>
                  {amount !== original && amount < original && (
                    <p className="text-xs text-amber-400">{(((original - amount) / original) * 100).toFixed(0)}% used</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Expense progress bar */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>Expense budget used</span>
              <span>{spentPercent}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  parseFloat(spentPercent) >= 90 ? "bg-rose-500" : parseFloat(spentPercent) >= 60 ? "bg-amber-500" : "bg-indigo-500"
                }`}
                style={{ width: `${Math.min(parseFloat(spentPercent), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm text-slate-400">No transactions yet</p>
              <button
                onClick={() => onNavigate("add-expense")}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Add your first expense →
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {(expanded ? [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10) : recentExpenses).map(expense => (
                <div key={expense.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-700/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center text-lg">
                      {expense.category === "Food & Dining" ? "🍔" :
                       expense.category === "Transportation" ? "🚗" :
                       expense.category === "Entertainment" ? "🎬" :
                       expense.category === "Shopping" ? "🛍️" :
                       expense.category === "Health & Fitness" ? "💪" :
                       expense.category === "Education" ? "📚" :
                       expense.category === "Utilities & Bills" ? "💡" :
                       expense.category === "Subscriptions" ? "📱" :
                       expense.category === "Travel" ? "✈️" :
                       expense.category === "Personal Care" ? "💅" :
                       expense.category === "Gifts & Donations" ? "🎁" : "📦"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{expense.category}</p>
                      <p className="text-xs text-slate-500">{expense.date}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-rose-400">-{format(expense.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories + Quick actions */}
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Top Spending Categories</h3>
            </div>
            {topCategories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500">No spending data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topCategories.map(([category, amount]) => {
                  const totalExpense = totalSpending || 1;
                  const pct = ((amount / totalExpense) * 100).toFixed(0);
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{category}</span>
                        <span className="text-white font-medium">{format(amount)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{pct}% of total</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate("add-expense")}
                className="flex flex-col items-center gap-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 transition-all group"
              >
                <Plus className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-300">Add Expense</span>
              </button>
              <button
                onClick={() => onNavigate("analytics")}
                className="flex flex-col items-center gap-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 transition-all group"
              >
                <BarChart3 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-300">Analytics</span>
              </button>
              <button
                onClick={() => onNavigate("projections")}
                className="flex flex-col items-center gap-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 transition-all group"
              >
                <TrendingUp className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-300">Projections</span>
              </button>
              <button
                onClick={() => onNavigate("expenses")}
                className="flex flex-col items-center gap-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl p-4 transition-all group"
              >
                <Calendar className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-slate-300">Transactions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
