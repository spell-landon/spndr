// app/types/index.ts
export interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
}

export interface UserSettings {
  id?: string;
  user_id: string;
  starting_balance: number;
  starting_balance_locked: boolean;
  currency: string;
  date_format: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id?: string;
  user_id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  type: 'income' | 'expense';
  notes?: string;
  created_at?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  archived: boolean;
}

export interface BudgetCategory {
  id?: string;
  user_id: string;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  archived: boolean;
  subcategories: Subcategory[];
  created_at?: string;
}

export interface Goal {
  id?: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  progress: number;
  created_at?: string;
}

export interface RecurringTransaction {
  id?: string;
  user_id: string;
  name: string;
  amount: number;
  frequency: string;
  next_due: string;
  created_at?: string;
  merchant?: string;
  category?: string;
  account?: string;
}

export interface MonthlyBudget {
  id?: string;
  user_id: string;
  month: string; // YYYY-MM-DD format (first day of month)
  total_income: number;
  total_expenses: number;
  total_budgeted: number;
  categories: BudgetCategory[];
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}
