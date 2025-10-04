import { supabase } from './supabase';
import { type BudgetCategory } from '~/types';

// ✅ Get all categories for a user
export const getCategories = async (
  userId: string
): Promise<BudgetCategory[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// ✅ Add a new category
export const addCategory = async (userId: string, category: BudgetCategory) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...category, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ✅ Update an existing category
export const updateCategory = async (category: BudgetCategory) => {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      budgeted: category.budgeted,
      spent: category.spent,
      remaining: category.remaining,
    })
    .eq('id', category.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ✅ Delete a category
export const deleteCategory = async (id: string) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};
