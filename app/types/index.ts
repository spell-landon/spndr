export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
  name?: string; // optional convenience fallback
}

export interface Transaction {
  $id?: string;
  id?: number;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  account: string;
  type: 'income' | 'expense';
  userId: string;
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
  $id?: string;
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  archived: boolean;
  subcategories: Subcategory[];
  userId: string;
}

export interface Goal {
  $id?: string;
  id: number;
  name: string;
  target: number;
  current: number;
  progress: number;
  userId: string;
}

export interface RecurringTransaction {
  $id?: string;
  id: number;
  name: string;
  amount: number;
  frequency: string;
  nextDue: string;
  userId: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}
