"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import type { Expense } from "@/lib/types";

interface AnalyticsProps {
  expenses: Expense[];
  categorySpending: Record<string, number>;
  totalSpending: number;
  monthlyIncome: number;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
  "#a855f7", "#64748b",
];

const categoryEmoji: Record<string, string> = {
  "Food & Dining": "🍔", "Transportation": "🚗", "Entertainment": "🎬",
  "Shopping": "🛍️", "Health & Fitness": "💪", "Education": "📚",
  "Utilities & Bills": "💡", "Subscriptions": "📱", "Travel": "✈️",
  "Personal Care": "💅", "Gifts & Donations": "🎁", "Other": "📦",
};

function format(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function Analytics({ expenses, categorySpending, totalSpending, monthlyIncome }: AnalyticsProps) {
  // Pie chart data
  const pieData = Object.entries(categorySpending)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Daily spending over time
  const dailyData: Record<string, number> = {};
  expenses.forEach(e => {
    dailyData[e.date] = (dailyData[e.date] || 0) + e.amount;
  });
  const dailyChartData = Object.entries(dailyData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Monthly summary
  const monthlyData: Record<string, number> = {};
  expenses.forEach(e => {
    const month = e.date.substring(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + e.amount;
  });

  // Average expense
  const avgExpense = expenses.length > 0 ? totalSpending / expenses.length : 0;
  const maxExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
  const budgetUsed = monthlyIncome > 0 ? ((totalSpending / (monthlyIncome / 3)) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Detailed spending insights and patterns</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-sm text-slate-400 mb-1">Total Spent</p>
          <p className="text-xl font-bold text-white">{format(totalSpending)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-sm text-slate-400 mb-1">Avg per Transaction</p>
          <p className="text-xl font-bold text-white">{format(avgExpense)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-sm text-slate-400 mb-1">Largest Expense</p>
          <p className="text-xl font-bold text-rose-400">{format(maxExpense)}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-sm text-slate-400 mb-1">Budget Used</p>
          <p className={`text-xl font-bold ${parseFloat(budgetUsed) >= 90 ? "text-rose-400" : parseFloat(budgetUsed) >= 60 ? "text-amber-400" : "text-emerald-400"}`}>
            {budgetUsed}%
          </p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
          <p className="text-slate-400 font-medium">No spending data yet</p>
          <p className="text-slate-500 text-sm mt-1">Add expenses to see analytics</p>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pie chart - spending by category */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Spending by Category
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown) => format(Number(value))}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#f8fafc",
                        fontSize: "13px",
                      }}
                    />
                    <Legend
                      formatter={(value) => `${categoryEmoji[value] || ""} ${value}`}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Spending by Day
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(v: string) => v.substring(5)}
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v: number) => `$${v}`} />
                    <Tooltip
                      formatter={(v: unknown) => format(Number(v))}
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#f8fafc",
                        fontSize: "13px",
                      }}
                    />
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category breakdown table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Category Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-xs font-medium text-slate-400 py-3 px-4">Category</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Total</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">% of Budget</th>
                    <th className="text-right text-xs font-medium text-slate-400 py-3 px-4">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categorySpending)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, total]) => {
                      const count = expenses.filter(e => e.category === category).length;
                      const pctOfBudget = monthlyIncome > 0 ? ((total / (monthlyIncome / 3)) * 100).toFixed(1) : "0.0";
                      return (
                        <tr key={category} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-all">
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-2 text-sm text-white">
                              <span className="text-lg">{categoryEmoji[category] || "📦"}</span>
                              {category}
                              <span className="text-xs text-slate-500">({count})</span>
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-sm font-semibold text-white">{format(total)}</td>
                          <td className="text-right py-3 px-4">
                            <span className={`text-sm font-medium ${
                              parseFloat(pctOfBudget) >= 100 ? "text-rose-400" : "text-slate-300"
                            }`}>
                              {pctOfBudget}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-sm text-slate-400">{format(total / count)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cumulative spending line */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Cumulative Spending</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v: string) => v.substring(5)}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip
                    formatter={(v: unknown) => format(Number(v))}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
