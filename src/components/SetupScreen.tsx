"use client";

import { useState, useCallback } from "react";
import { ArrowRight, ShieldCheck, Wallet, DollarSign, AlertCircle } from "lucide-react";

interface SetupScreenProps {
  onComplete: (income: number, liability: number) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [income, setIncome] = useState("");
  const [liability, setLiability] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleIncomeSubmit = useCallback(() => {
    const val = parseFloat(income);
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid income amount greater than zero.");
      return;
    }
    setError("");
    setStep(2);
  }, [income]);

  const handleComplete = useCallback(() => {
    const val = parseFloat(liability);
    if (isNaN(val) || val < 0) {
      setError("Please enter a valid liability amount (0 or more).");
      return;
    }
    setError("");
    onComplete(parseFloat(income), val);
  }, [income, liability, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 mb-4">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">FinFlow</h1>
          <p className="text-slate-400 mt-1">Smart Income & Expense Manager</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              step >= 1 ? "bg-indigo-500" : "bg-slate-700"
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              step >= 2 ? "bg-indigo-500" : "bg-slate-700"
            }`}
          />
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-white">What&apos;s your monthly income?</h2>
                <p className="text-slate-400 text-sm mt-1">We&apos;ll divide it into three equal parts</p>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => {
                    setIncome(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleIncomeSubmit()}
                  placeholder="0.00"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-2xl py-4 pl-10 pr-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  autoFocus
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-sm text-indigo-300">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Income will be split equally: <strong>Liability (33%)</strong>,{" "}
                    <strong>Investment (33%)</strong>, <strong>Expenses (33%)</strong>
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleIncomeSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-white">Current liabilities?</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Enter your existing monthly liability obligations
                </p>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={liability}
                  onChange={(e) => {
                    setLiability(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                  placeholder="0.00"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-2xl py-4 pl-10 pr-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  autoFocus
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-sm text-emerald-300">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Existing liabilities will be deducted from your liability allocation first, then
                    from expenses if needed.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-[2] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
