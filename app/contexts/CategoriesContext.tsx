// app/contexts/CategoriesContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'income' | 'expense';
  parent_id: string | null;
  icon?: string;
  color?: string;
  archived: boolean;
  sort_order: number;
  subcategories?: Category[];
}

interface CategoriesContextType {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (
    category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories_old')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Organize into parent-child structure
      const organized = organizeCategories(data || []);
      setCategories(organized);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeCategories = (flatCategories: any[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const roots: Category[] = [];

    // First pass: create all category objects
    flatCategories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, subcategories: [] });
    });

    // Second pass: organize into parent-child
    flatCategories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.subcategories!.push(category);
        }
      } else {
        roots.push(category);
      }
    });

    return roots;
  };

  const addCategory = async (
    category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('categories_old')
        .insert({ ...category, user_id: user.id });

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories_old')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories_old')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const getCategoryById = (id: string): Category | undefined => {
    for (const cat of categories) {
      if (cat.id === id) return cat;
      if (cat.subcategories) {
        const found = cat.subcategories.find((sub) => sub.id === id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const incomeCategories = categories.filter(
    (c) => c.type === 'income' && !c.archived
  );
  const expenseCategories = categories.filter(
    (c) => c.type === 'expense' && !c.archived
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        incomeCategories,
        expenseCategories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
      }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
