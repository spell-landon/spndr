// app/lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          user_id: string;
          merchant: string;
          category: string;
          amount: number;
          date: string;
          account: string;
          type: 'income' | 'expense';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          merchant: string;
          category: string;
          amount: number;
          date: string;
          account: string;
          type: 'income' | 'expense';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          merchant?: string;
          category?: string;
          amount?: number;
          date?: string;
          account?: string;
          type?: 'income' | 'expense';
          notes?: string | null;
          created_at?: string;
        };
      };
      budget_categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          budgeted: number;
          spent: number;
          remaining: number;
          archived: boolean;
          subcategories: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          budgeted?: number;
          spent?: number;
          remaining?: number;
          archived?: boolean;
          subcategories?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          budgeted?: number;
          spent?: number;
          remaining?: number;
          archived?: boolean;
          subcategories?: Json;
          created_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target: number;
          current: number;
          progress: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target: number;
          current?: number;
          progress?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target?: number;
          current?: number;
          progress?: number;
          created_at?: string;
        };
      };
      recurring_transactions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          frequency: string;
          next_due: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          frequency: string;
          next_due: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          frequency?: string;
          next_due?: string;
          created_at?: string;
        };
      };
      monthly_budgets: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          total_income: number;
          total_expenses: number;
          total_budgeted: number;
          categories: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          total_income?: number;
          total_expenses?: number;
          total_budgeted?: number;
          categories?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          total_income?: number;
          total_expenses?: number;
          total_budgeted?: number;
          categories?: Json;
          created_at?: string;
        };
      };
    };
  };
}
