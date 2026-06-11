"use client";

import { useState, useMemo } from "react";
import { Search, Filter, X, Trash2, Calendar, Download, Receipt } from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import type { Expense } from "@/lib/types";

interface ExpensesListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const categoryEmoji: Record<string, string> = {
  "Food & Dining": "🍔",
  Transportation: "🚗",
  Entertainment: "🎬",
  Shopping: "🛍️",
  "Health & Fitness": "💪",
  Education: "📚",
  "Utilities & Bills": "💡",
  Subscriptions: "📱",
  Travel: "✈️",
  "Personal Care": "💅",
  "Gifts & Donations": "🎁",
  Other: "📦",
};

function format(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function ExpensesList({ expenses, onDelete }: ExpensesListProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...expenses];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.category.toLowerCase().includes(s) ||
          (e.note && e.note.toLowerCase().includes(s)) ||
          e.date.includes(s) ||
          e.amount.toString().includes(s)
      );
    }

    if (filterCategory) {
      result = result.filter((e) => e.category === filterCategory);
    }

    result.sort((a, b) => {
      const mult = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "date") return mult * a.date.localeCompare(b.date);
      return mult * (a.amount - b.amount);
    });

    return result;
  }, [expenses, search, filterCategory, sortBy, sortOrder]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  const exportCSV = () => {
    const header = "Date,Category,Amount,Note\n";
    const rows = filtered
      .map((e) => `${e.date},"${e.category}",${e.amount.toFixed(2)},"${e.note || ""}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 mt-1">
            {expenses.length} total • {filtered.length} shown • {format(totalFiltered)}
          </p>
        </div>
        {expenses.length > 0 && (
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all self-start"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Search and filter bar */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              showFilters
                ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-slate-800">
                  {c}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split("-") as [
                  "date" | "amount",
                  "asc" | "desc"
                ];
                setSortBy(by);
                setSortOrder(order);
              }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date-desc" className="bg-slate-800">
                Newest First
              </option>
              <option value="date-asc" className="bg-slate-800">
                Oldest First
              </option>
              <option value="amount-desc" className="bg-slate-800">
                Highest Amount
              </option>
              <option value="amount-asc" className="bg-slate-800">
                Lowest Amount
              </option>
            </select>

            {(filterCategory || search) && (
              <button
                onClick={() => {
                  setFilterCategory("");
                  setSearch("");
                }}
                className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300 px-3 py-2"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No expenses found</p>
          <p className="text-slate-500 text-sm mt-1">
            {search || filterCategory
              ? "Try adjusting your filters"
              : "Start tracking your expenses"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => (
            <div
              key={expense.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 hover:border-slate-600/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl flex-shrink-0">
                  {categoryEmoji[expense.category] || "📦"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{expense.category}</h3>
                    {expense.note && (
                      <span className="text-xs text-slate-500 truncate">• {expense.note}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {expense.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-rose-400">-{format(expense.amount)}</p>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
