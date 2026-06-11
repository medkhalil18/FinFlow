"use client";

import { useState } from "react";
import type { Page } from "@/lib/types";
import {
  LayoutDashboard, PlusCircle, Receipt, BarChart3, TrendingUp, Settings,
  X, DollarSign, ChevronRight, LogOut,
} from "lucide-react";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  sidebarOpen: boolean;
  onClose: () => void;
  onResetAll: () => void;
  email: string;
  monthlyIncome?: number;
}

const NAV_ITEMS: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "add-expense", label: "Add Expense", icon: PlusCircle },
  { page: "expenses", label: "Transactions", icon: Receipt },
  { page: "analytics", label: "Analytics", icon: BarChart3 },
  { page: "projections", label: "Projections", icon: TrendingUp },
  { page: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, sidebarOpen, onClose, onResetAll, email, monthlyIncome = 0 }: SidebarProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navigate = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-50 bg-slate-900 border-r border-slate-800
        transition-transform duration-300 ease-in-out
        w-72 flex flex-col
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">FinFlow</h1>
                <p className="text-xs text-slate-500 truncate max-w-[120px]">{email}</p>
              </div>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Income badge */}
        <div className="px-6 py-4">
          <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-4">
            <p className="text-xs text-indigo-300 mb-1">Monthly Income</p>
            <p className="text-xl font-bold text-white">{formatCurrency(monthlyIncome)}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => navigate(page)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${currentPage === page
                  ? "bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/5"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${currentPage === page ? "text-indigo-400" : ""}`} />
              {label}
              {currentPage === page && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
            </button>
          ))}
        </nav>

        {/* Reset */}
        <div className="p-4 border-t border-slate-800">
          {showResetConfirm ? (
            <div className="space-y-2">
              <p className="text-xs text-amber-400 text-center">Reset all data?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { onResetAll(); setShowResetConfirm(false); }}
                  className="flex-1 bg-rose-500 hover:bg-rose-400 text-white text-xs font-medium py-2 rounded-lg transition-all"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Reset All Data
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
