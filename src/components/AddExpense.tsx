"use client";

import { useState, useCallback } from "react";
import {
  PlusCircle,
  Calendar,
  Tag,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface AddExpenseProps {
  remaining: number;
  onAdd: (expense: { date: string; category: string; amount: number; note?: string }) => Promise<boolean>;
}

function format(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function AddExpense({ remaining, onAdd }: AddExpenseProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!date || !category || !amount) {
        setError("Please fill in all required fields.");
        return;
      }

      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        setError("Please enter a valid amount greater than zero.");
        return;
      }

      if (amountNum > remaining) {
        setError(`Amount exceeds your remaining allocation of ${format(remaining)}.`);
        return;
      }

      setLoading(true);
      const ok = await onAdd({ date, category, amount: amountNum, note: note || undefined });
      setLoading(false);

      if (ok) {
        setSuccess(true);
        setCategory("");
        setAmount("");
        setNote("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to add expense. Please try again.");
      }
    },
    [date, category, amount, note, remaining, onAdd]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Add Expense</h1>
        <p className="text-slate-400 mt-1">Track your personal expenses</p>
      </div>

      {/* Budget info */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-300 mb-1">Available Budget</p>
            <p className="text-2xl font-bold text-white">{format(remaining)}</p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              remaining > 100
                ? "bg-emerald-500/20"
                : remaining > 0
                ? "bg-amber-500/20"
                : "bg-rose-500/20"
            }`}
          >
            {remaining > 100 ? (
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            ) : remaining > 0 ? (
              <AlertCircle className="w-7 h-7 text-amber-400" />
            ) : (
              <AlertCircle className="w-7 h-7 text-rose-400" />
            )}
          </div>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Expense added successfully!</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-5"
      >
        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Tag className="w-4 h-4 text-indigo-400" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
            required
          >
            <option value="" className="bg-slate-800">
              Select a category
            </option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-800">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <DollarSign className="w-4 h-4 text-indigo-400" />
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Note <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this expense..."
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={remaining <= 0 || loading}
          className={`w-full font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
            remaining <= 0
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              {remaining <= 0 ? "Budget Exhausted" : "Add Expense"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
