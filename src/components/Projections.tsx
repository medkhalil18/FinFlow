"use client";

import { TrendingUp, PiggyBank, ArrowUpRight, Star, Trophy, Target } from "lucide-react";

interface ProjectionsProps {
  monthlyIncome: number;
  allocation: { liability: number; invest: number; expense: number };
  totalSpending: number;
  uniqueMonths: number;
}

function format(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function Projections({
  monthlyIncome,
  allocation,
  totalSpending,
  uniqueMonths,
}: ProjectionsProps) {
  const months = [1, 3, 6, 12, 24, 36];
  const remainingExpense = allocation.expense;

  const projections = months.map((m) => ({
    months: m,
    label:
      m === 1
        ? "1 Month"
        : m === 12
        ? "1 Year"
        : m === 24
        ? "2 Years"
        : m === 36
        ? "3 Years"
        : `${m} Months`,
    liability: allocation.liability * m,
    investment: allocation.invest * m,
    totalSavings: allocation.invest * m + remainingExpense * m,
    totalIncome: monthlyIncome * m,
  }));

  const avgMonthlySpend = uniqueMonths > 0 ? totalSpending / uniqueMonths : 0;

  const investmentAtReturn = (rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    if (monthlyRate === 0) return allocation.invest * n;
    return allocation.invest * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
  };

  const roiProjections = [
    { rate: 5, label: "Conservative (5%)", color: "text-emerald-400", barColor: "bg-emerald-500" },
    { rate: 8, label: "Moderate (8%)", color: "text-indigo-400", barColor: "bg-indigo-500" },
    { rate: 12, label: "Aggressive (12%)", color: "text-violet-400", barColor: "bg-violet-500" },
  ];

  const maxInvestment = Math.max(
    ...roiProjections.map((r) => investmentAtReturn(r.rate, 10)),
    allocation.invest * 120
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Projections</h1>
        <p className="text-slate-400 mt-1">See where your money will take you</p>
      </div>

      {/* Milestones */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-indigo-300">Monthly Target</h3>
          </div>
          <p className="text-2xl font-bold text-white">{format(monthlyIncome)}</p>
          <p className="text-xs text-slate-400 mt-1">Total monthly income</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-300">1 Year Savings</h3>
          </div>
          <p className="text-2xl font-bold text-white">{format(allocation.invest * 12)}</p>
          <p className="text-xs text-slate-400 mt-1">Investment allocation</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-300">Free Cash</h3>
          </div>
          <p className="text-2xl font-bold text-white">{format(remainingExpense)}</p>
          <p className="text-xs text-slate-400 mt-1">Remaining this month</p>
        </div>
      </div>

      {/* Projections table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Growth Over Time</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-xs font-medium text-slate-400 py-3 px-5">Period</th>
                <th className="text-right text-xs font-medium text-slate-400 py-3 px-5">Liability Paid</th>
                <th className="text-right text-xs font-medium text-slate-400 py-3 px-5">Invested</th>
                <th className="text-right text-xs font-medium text-slate-400 py-3 px-5">Total Saved</th>
                <th className="text-right text-xs font-medium text-slate-400 py-3 px-5">Total Income</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p) => (
                <tr key={p.months} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-all">
                  <td className="py-4 px-5">
                    <span className="text-sm font-semibold text-white">{p.label}</span>
                  </td>
                  <td className="text-right py-4 px-5 text-sm text-amber-400 font-medium">{format(p.liability)}</td>
                  <td className="text-right py-4 px-5 text-sm text-emerald-400 font-medium">{format(p.investment)}</td>
                  <td className="text-right py-4 px-5 text-sm text-white font-bold">{format(p.totalSavings)}</td>
                  <td className="text-right py-4 px-5 text-sm text-slate-400">{format(p.totalIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investment returns projection */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">10-Year Investment Projection</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Based on {format(allocation.invest)}/month invested
        </p>

        <div className="space-y-4">
          {roiProjections.map(({ rate, label, color, barColor }) => {
            const total = investmentAtReturn(rate, 10);
            const pct = (total / maxInvestment) * 100;
            const totalContributed = allocation.invest * 120;
            const returns = total - totalContributed;

            return (
              <div key={rate} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <span className={`font-bold ${color}`}>{format(total)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Contributed: {format(totalContributed)}</span>
                  <span className={color}>Returns: +{format(returns)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial tips */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Financial Insights</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-1">
            <p className="text-sm text-white font-medium">💡 Spend Less, Save More</p>
            <p className="text-xs text-slate-400">
              Your average monthly spending is {format(avgMonthlySpend)}.
              {avgMonthlySpend > monthlyIncome / 3
                ? " That's above your expense allocation. Consider cutting back."
                : " Well within your budget. Keep it up!"}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-1">
            <p className="text-sm text-white font-medium">🚀 Investment Power</p>
            <p className="text-xs text-slate-400">
              Investing {format(allocation.invest)}/month at 8% annual return could grow to{" "}
              <span className="text-indigo-400 font-semibold">{format(investmentAtReturn(8, 10))}</span> in 10 years.
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-1">
            <p className="text-sm text-white font-medium">🛡️ Liability Coverage</p>
            <p className="text-xs text-slate-400">
              You&apos;re allocating {format(allocation.liability)}/month to liabilities.
              {allocation.liability === 0
                ? " Your existing liabilities consume your full liability allocation."
                : " You have room to cover upcoming obligations."}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4 space-y-1">
            <p className="text-sm text-white font-medium">📊 The 1/3 Rule</p>
            <p className="text-xs text-slate-400">
              Your income is split equally across liabilities, investments, and expenses — a proven framework for financial stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
