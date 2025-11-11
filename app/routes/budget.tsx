// app/routes/budget.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { BudgetCategory, MonthlyBudget } from '../types';
import {
  Plus,
  Edit3,
  Trash2,
  Archive,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Money from '~/components/Money';

export default function Budget() {
  const { user } = useAuth();
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(
    []
  );
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) + '-01'
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBudgetCategories();
      fetchMonthlyBudgets();
    }
  }, [user, selectedMonth]);

  const fetchBudgetCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_categories_old')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBudgetCategories(data || []);
    } catch (error) {
      console.error('Error fetching budget categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_budgets')
        .select('*')
        .eq('user_id', user!.id)
        .order('month', { ascending: false })
        .limit(12);

      if (error) throw error;
      setMonthlyBudgets(data || []);
    } catch (error) {
      console.error('Error fetching monthly budgets:', error);
    }
  };

  const saveMonthlySnapshot = async () => {
    try {
      const totalBudgeted = budgetCategories.reduce(
        (sum, cat) => sum + cat.budgeted,
        0
      );
      const totalSpent = budgetCategories.reduce(
        (sum, cat) => sum + cat.spent,
        0
      );

      const { error } = await supabase.from('monthly_budgets').upsert(
        {
          user_id: user!.id,
          month: currentMonth,
          total_income: 0, // Calculate from transactions
          total_expenses: totalSpent,
          total_budgeted: totalBudgeted,
          categories: budgetCategories,
        },
        {
          onConflict: 'user_id,month',
        }
      );

      if (error) throw error;
      fetchMonthlyBudgets();
    } catch (error) {
      console.error('Error saving monthly snapshot:', error);
    }
  };

  const handleCategorySave = async (
    categoryData: BudgetCategory,
    parentId?: string
  ) => {
    try {
      if (parentId) {
        // Handle subcategory
        const parentCat = budgetCategories.find((c) => c.id === parentId);
        if (!parentCat) return;

        const updatedSubcategories = [...parentCat.subcategories];
        const existingIndex = updatedSubcategories.findIndex(
          (s) => s.id === categoryData.id
        );

        if (existingIndex >= 0) {
          updatedSubcategories[existingIndex] = categoryData.subcategories[0];
        } else {
          updatedSubcategories.push({
            ...categoryData.subcategories[0],
            id: Date.now(),
          });
        }

        const { error } = await supabase
          .from('budget_categories_old')
          .update({ subcategories: updatedSubcategories })
          .eq('id', parentId);

        if (error) throw error;
      } else {
        // Handle category
        if (categoryData.id) {
          const { error } = await supabase
            .from('budget_categories_old')
            .update(categoryData)
            .eq('id', categoryData.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('budget_categories_old')
            .insert({ ...categoryData, user_id: user!.id });

          if (error) throw error;
        }
      }

      fetchBudgetCategories();
      saveMonthlySnapshot();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('budget_categories_old')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      fetchBudgetCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const CategoryModal = ({
    category,
    subcategory,
    onClose,
    onSave,
    parentId,
  }: any) => {
    const [formData, setFormData] = useState({
      name: category?.name || subcategory?.name || '',
      budgeted: category?.budgeted || subcategory?.budgeted || 0,
      spent: category?.spent || subcategory?.spent || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const remaining = formData.budgeted - formData.spent;

      if (subcategory || parentId) {
        onSave(
          {
            subcategories: [
              {
                ...(subcategory || {}),
                ...formData,
                remaining,
                id: subcategory?.id || Date.now(),
                archived: false,
              },
            ],
          },
          parentId
        );
      } else {
        onSave({
          ...(category || {}),
          ...formData,
          remaining,
          archived: false,
          subcategories: category?.subcategories || [],
        });
      }
      onClose();
    };

    return (
      <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 w-96'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {category?.id || subcategory?.id ? 'Edit' : 'Add'}{' '}
              {parentId ? 'Subcategory' : 'Category'}
            </h2>
            <button
              onClick={onClose}
              className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
              <X className='w-6 h-6' />
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Budgeted
              </label>
              <div className='relative'>
                <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
                <input
                  type='number'
                  step='0.01'
                  value={formData.budgeted}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budgeted: parseFloat(e.target.value) || 0,
                    })
                  }
                  className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Spent
              </label>
              <div className='relative'>
                <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
                <input
                  type='number'
                  step='0.01'
                  value={formData.spent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      spent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                />
              </div>
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 px-4 py-2 text-monarch-neutral-600 border rounded-lg hover:bg-monarch-neutral-50'>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const chartData = monthlyBudgets
    .map((mb) => ({
      month: new Date(mb.month).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      budgeted: <Money value={mb.total_budgeted} />,
      spent: <Money value={mb.total_expenses} />,
    }))
    .reverse();

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const totalBudgeted = budgetCategories.reduce(
    (sum, cat) => sum + cat.budgeted,
    0
  );
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-monarch-neutral-800'>Budget</h1>
        <div className='flex items-center gap-4'>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='px-4 py-2 border border-black/50 rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
            <option value={currentMonth}>Current Month</option>
            {monthlyBudgets.map((mb) => (
              <option key={mb.id} value={mb.month}>
                {getMonthName(mb.month)}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryModal(true);
            }}
            className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
            <Plus className='w-4 h-4' />
            Add Category
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-monarch-neutral-600'>
              Total Budgeted
            </h3>
            <TrendingUp className='w-5 h-5 text-monarch-blue-500' />
          </div>
          <p className='text-2xl font-bold text-monarch-neutral-800'>
            <Money value={totalBudgeted} />
          </p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-monarch-neutral-600'>
              Total Spent
            </h3>
            <TrendingDown className='w-5 h-5 text-monarch-red-500' />
          </div>
          <p className='text-2xl font-bold text-monarch-neutral-800'>
            <Money value={totalSpent} />
          </p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium text-monarch-neutral-600'>
              Remaining
            </h3>
            <DollarSign className='w-5 h-5 text-monarch-green-500' />
          </div>
          <p
            className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-monarch-green-600' : 'text-monarch-red-600'}`}>
            <Money value={totalRemaining} />
          </p>
        </div>
      </div>

      {/* Historical Chart */}
      {chartData.length > 0 && (
        <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
          <h3 className='text-lg font-semibold text-monarch-neutral-800 mb-4'>
            Budget History (Last 12 Months)
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='budgeted'
                stroke='#f97316'
                strokeWidth={2}
                name='Budgeted'
              />
              <Line
                type='monotone'
                dataKey='spent'
                stroke='#ef4444'
                strokeWidth={2}
                name='Spent'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Budget Categories */}
      <div className='space-y-4'>
        {budgetCategories
          .filter((cat) => !cat.archived)
          .map((category) => (
            <div key={category.id} className='bg-white rounded-xl shadow-sm'>
              <div className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <button className='cursor-move text-monarch-neutral-400 hover:text-monarch-neutral-600'>
                      <GripVertical className='w-5 h-5' />
                    </button>

                    <button
                      onClick={() =>
                        setExpandedCategories((prev) => ({
                          ...prev,
                          [category.id!]: !prev[category.id!],
                        }))
                      }
                      className='text-monarch-neutral-600 hover:text-monarch-neutral-800'>
                      {expandedCategories[category.id!] ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </button>

                    <div>
                      <h3 className='font-semibold text-monarch-neutral-800'>
                        {category.name}
                      </h3>
                      <p className='text-sm text-monarch-neutral-600'>
                        <Money value={category.spent} /> of{' '}
                        <Money value={category.budgeted} /> spent
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='font-semibold text-lg'>
                        <Money value={category.remaining} />
                      </p>
                      <p className='text-sm text-monarch-neutral-600'>
                        remaining
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryModal(true);
                        }}
                        className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                        <Edit3 className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(category.id!)}
                        className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
                        <Trash2 className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => {
                          setEditingSubcategory(null);
                          setParentCategoryId(category.id!);
                          setShowSubcategoryModal(true);
                        }}
                        className='text-monarch-orange-500 hover:text-monarch-orange-600 p-1'>
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mt-4'>
                  <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
                    <div
                      className='bg-monarch-orange-500 h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%`,
                      }}></div>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories[category.id!] &&
                category.subcategories.length > 0 && (
                  <div className='border-t bg-monarch-neutral-50'>
                    {category.subcategories
                      .filter((sub) => !sub.archived)
                      .map((sub) => (
                        <div
                          key={sub.id}
                          className='px-4 py-3 border-b last:border-b-0'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <button className='cursor-move text-monarch-neutral-400 hover:text-monarch-neutral-600 ml-8'>
                                <GripVertical className='w-4 h-4' />
                              </button>

                              <div className='w-3 h-3 bg-monarch-green-500 rounded-full'></div>

                              <div>
                                <span className='text-sm font-medium text-monarch-neutral-700'>
                                  {sub.name}
                                </span>
                                <p className='text-xs text-monarch-neutral-500'>
                                  <Money value={sub.spent} /> of{' '}
                                  <Money value={sub.budgeted} />
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-6'>
                              <div className='flex gap-6 text-sm'>
                                <span className='text-monarch-neutral-600'>
                                  Budget: <Money value={sub.budgeted} />
                                </span>
                                <span className='text-monarch-neutral-600'>
                                  Spent: <Money value={sub.spent} />
                                </span>
                                <span className='text-monarch-green-600 font-medium'>
                                  Remaining: <Money value={sub.remaining} />
                                </span>
                              </div>

                              <div className='flex items-center gap-1'>
                                <button
                                  onClick={() => {
                                    setEditingSubcategory(sub);
                                    setParentCategoryId(category.id!);
                                    setShowSubcategoryModal(true);
                                  }}
                                  className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                                  <Edit3 className='w-3 h-3' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
            </div>
          ))}
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={handleCategorySave}
        />
      )}

      {showSubcategoryModal && (
        <CategoryModal
          subcategory={editingSubcategory}
          parentId={parentCategoryId}
          onClose={() => {
            setShowSubcategoryModal(false);
            setEditingSubcategory(null);
            setParentCategoryId(null);
          }}
          onSave={handleCategorySave}
        />
      )}
    </div>
  );
}
