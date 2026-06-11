"use client";

import {
  Settings as SettingsIcon,
  RotateCcw,
  Trash2,
  Info,
  DollarSign,
  Shield,
  TrendingUp,
  LogOut,
} from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface SettingsProps {
  profile: UserProfile;
  totalExpenses: number;
  expenseCount: number;
  onResetExpenses: () => void;
  onResetAll: () => void;
  onLogout: () => void;
}

function format(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function Settings({
  profile,
  totalExpenses,
  expenseCount,
  onResetExpenses,
  onResetAll,
  onLogout,
}: SettingsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your preferences and data</p>
      </div>

      {/* Account info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Financial Profile</h3>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-400">
              {profile.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{profile.email}</p>
            <p className="text-xs text-slate-500">Logged in</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-slate-400">Monthly Income</span>
            </div>
            <p className="text-lg font-bold text-white">{format(profile.monthlyIncome)}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Existing Liability</span>
            </div>
            <p className="text-lg font-bold text-white">{format(profile.existingLiability)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-400">Current Allocation</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-300 mb-1">Liability</p>
              <p className="text-sm font-bold text-white">
                {format(profile.allocation.liability)}
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-300 mb-1">Investment</p>
              <p className="text-sm font-bold text-white">{format(profile.allocation.invest)}</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-center">
              <p className="text-xs text-indigo-300 mb-1">Expenses</p>
              <p className="text-sm font-bold text-white">{format(profile.allocation.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Statistics</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-700/30 rounded-xl p-4">
            <span className="text-xs text-slate-400">Total Expenses Tracked</span>
            <p className="text-lg font-bold text-white">{expenseCount}</p>
          </div>
          <div className="bg-slate-700/30 rounded-xl p-4">
            <span className="text-xs text-slate-400">Total Amount Spent</span>
            <p className="text-lg font-bold text-rose-400">{format(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Actions</h3>
        </div>

        <button
          onClick={onResetExpenses}
          className="w-full flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 rounded-xl p-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Reset Expenses</p>
            <p className="text-xs text-slate-400">Clear all expenses and restore budget</p>
          </div>
        </button>

        <button
          onClick={onResetAll}
          className="w-full flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl p-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Reset Everything</p>
            <p className="text-xs text-slate-400">Delete all data and start fresh</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 bg-slate-700/50 border border-slate-600 hover:bg-slate-700 rounded-xl p-4 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-600/50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Sign Out</p>
            <p className="text-xs text-slate-400">Log out of your account</p>
          </div>
        </button>
      </div>

      {/* About */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">About FinFlow</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>
            FinFlow implements the{" "}
            <span className="text-white font-medium">1/3 Rule</span> for personal finance: your
            monthly income is split equally into three buckets — liabilities, investments, and
            personal expenses.
          </p>
          <p>
            All data is stored securely in the database. Each user has their own private expense
            tracking.
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.
          </p>
        </div>
      </div>
    </div>
  );
}
