export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note?: string;
}

export interface Allocation {
  liability: number;
  invest: number;
  expense: number;
}

export interface UserProfile {
  id: string;
  email: string;
  monthlyIncome: number;
  existingLiability: number;
  allocation: Allocation;
  isSetup: boolean;
}

export type Page = 'dashboard' | 'add-expense' | 'expenses' | 'analytics' | 'projections' | 'settings';

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Health & Fitness',
  'Education',
  'Utilities & Bills',
  'Subscriptions',
  'Travel',
  'Personal Care',
  'Gifts & Donations',
  'Other',
];
