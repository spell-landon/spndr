import { useEffect, useState } from 'react';
import {
  Plus,
  Edit3,
  Archive,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '~/lib/supabase';
import CategoryModal, {
  type Category,
} from '../components/modals/CategoryModal';

const BudgetPage = () => {
  const [budgetCategories, setBudgetCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(
    null
  );

  // Fetch all categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('budget_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      // Separate parent and subcategories
      const parents = (data ?? []).filter((c) => !c.parent_id);
      const subs = (data ?? []).filter((c) => c.parent_id);

      // Attach subcategories to parents
      const grouped = parents.map((parent) => ({
        ...parent,
        subcategories: subs.filter((s) => s.parent_id === parent.id),
      }));

      setBudgetCategories(grouped);
    };

    fetchCategories();
  }, []);

  // Add / Edit a category or subcategory
  const handleCategorySave = async (
    categoryData: Category,
    parentCategoryId?: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const payload = {
        name: categoryData.name,
        budgeted: categoryData.budgeted,
        spent: categoryData.spent,
        remaining: categoryData.budgeted - categoryData.spent,
        user_id: user.id,
        parent_id: parentCategoryId ?? null,
        archived: categoryData.archived ?? false,
      };

      if (categoryData.id) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('budget_categories')
          .update(payload)
          .eq('id', categoryData.id)
          .select()
          .single();

        if (error) throw error;

        setBudgetCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === updated.parent_id) {
              // update subcategory
              return {
                ...cat,
                subcategories: cat.subcategories?.map((sub) =>
                  sub.id === updated.id ? updated : sub
                ),
              };
            } else if (cat.id === updated.id) {
              // update parent category
              return { ...cat, ...updated };
            }
            return cat;
          })
        );
      } else {
        // Insert new
        const { data: inserted, error } = await supabase
          .from('budget_categories')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;

        if (parentCategoryId) {
          // Add as subcategory
          setBudgetCategories((prev) =>
            prev.map((cat) =>
              cat.id === parentCategoryId
                ? {
                    ...cat,
                    subcategories: [...(cat.subcategories ?? []), inserted],
                  }
                : cat
            )
          );
        } else {
          // Add as parent
          setBudgetCategories((prev) => [
            ...prev,
            { ...inserted, subcategories: [] },
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await supabase.from('budget_categories').delete().eq('id', categoryId);
    setBudgetCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  const handleDeleteSubcategory = async (categoryId: string, subId: string) => {
    await supabase.from('budget_categories').delete().eq('id', subId);
    setBudgetCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories?.filter((s) => s.id !== subId),
            }
          : cat
      )
    );
  };

  const handleArchiveCategory = async (categoryId: string) => {
    const cat = budgetCategories.find((c) => c.id === categoryId);
    if (!cat) return;
    await supabase
      .from('budget_categories')
      .update({ archived: !cat.archived })
      .eq('id', categoryId);

    setBudgetCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, archived: !c.archived } : c
      )
    );
  };

  const handleArchiveSubcategory = async (
    categoryId: string,
    subId: string
  ) => {
    const parent = budgetCategories.find((c) => c.id === categoryId);
    if (!parent) return;
    const sub = parent.subcategories?.find((s) => s.id === subId);
    if (!sub) return;
    await supabase
      .from('budget_categories')
      .update({ archived: !sub.archived })
      .eq('id', subId);

    setBudgetCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              subcategories: c.subcategories?.map((s) =>
                s.id === subId ? { ...s, archived: !s.archived } : s
              ),
            }
          : c
      )
    );
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Budget</h1>
        <div className='flex items-center gap-4'>
          <div className='text-right'>
            <p className='text-2xl font-bold text-green-600'>$1,268</p>
            <p className='text-sm text-gray-600'>Left to budget</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory({});
              setShowCategoryModal(true);
            }}
            className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2'>
            <Plus className='w-4 h-4' />
            Add Category
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        {budgetCategories
          .filter((cat) => !cat.archived)
          .map((category) => (
            <div
              key={category.id}
              className='bg-white rounded-xl shadow-sm border border-black/10 overflow-hidden'>
              <div className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <button className='cursor-move text-gray-400 hover:text-gray-600'>
                      <GripVertical className='w-5 h-5' />
                    </button>

                    <button
                      onClick={() => toggleCategoryExpansion(category.id!)}
                      className='text-gray-600 hover:text-gray-800'>
                      {expandedCategories[category.id!] ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </button>

                    <div>
                      <h3 className='font-semibold text-gray-800'>
                        {category.name}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        ${category.spent} of ${category.budgeted} spent
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='font-semibold text-lg'>
                        ${category.remaining}
                      </p>
                      <p className='text-sm text-gray-600'>remaining</p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryModal(true);
                        }}
                        className='text-gray-500 hover:text-blue-600 p-1'>
                        <Edit3 className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => handleArchiveCategory(category.id!)}
                        className='text-gray-500 hover:text-yellow-600 p-1'>
                        <Archive className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(category.id!)}
                        className='text-gray-500 hover:text-red-600 p-1'>
                        <Trash2 className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => {
                          setEditingSubcategory({});
                          setEditingCategory({ id: category.id });
                          setShowSubcategoryModal(true);
                        }}
                        className='text-orange-500 hover:text-orange-600 p-1'>
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>

                <div className='mt-4'>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%`,
                      }}></div>
                  </div>
                </div>
              </div>

              {expandedCategories[category.id!] && (
                <div className='border-t border-black/10 bg-gray-50'>
                  {category.subcategories
                    ?.filter((sub) => !sub.archived)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className='px-4 py-3 border-b border-black/10 last:border-b-0'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <button className='cursor-move text-gray-400 hover:text-gray-600 ml-8'>
                              <GripVertical className='w-4 h-4' />
                            </button>

                            <div className='w-3 h-3 bg-green-500 rounded-full'></div>

                            <div>
                              <span className='text-sm font-medium text-gray-700'>
                                {sub.name}
                              </span>
                              <p className='text-xs text-gray-500'>
                                ${sub.spent} of ${sub.budgeted}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-6'>
                            <div className='flex gap-6 text-sm'>
                              <span className='text-gray-600'>
                                Budget: ${sub.budgeted}
                              </span>
                              <span className='text-gray-600'>
                                Spent: ${sub.spent}
                              </span>
                              <span className='text-green-600 font-medium'>
                                Remaining: ${sub.remaining}
                              </span>
                            </div>

                            <div className='flex items-center gap-1'>
                              <button
                                onClick={() => {
                                  setEditingSubcategory(sub);
                                  setEditingCategory({ id: category.id });
                                  setShowSubcategoryModal(true);
                                }}
                                className='text-gray-500 hover:text-blue-600 p-1'>
                                <Edit3 className='w-3 h-3' />
                              </button>

                              <button
                                onClick={() =>
                                  handleArchiveSubcategory(
                                    category.id!,
                                    sub.id!
                                  )
                                }
                                className='text-gray-500 hover:text-yellow-600 p-1'>
                                <Archive className='w-3 h-3' />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteSubcategory(category.id!, sub.id!)
                                }
                                className='text-gray-500 hover:text-red-600 p-1'>
                                <Trash2 className='w-3 h-3' />
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
          category={editingSubcategory}
          onClose={() => {
            setShowSubcategoryModal(false);
            setEditingSubcategory(null);
            setEditingCategory(null);
          }}
          onSave={(data) => handleCategorySave(data, editingCategory?.id)}
        />
      )}
    </div>
  );
};

export default BudgetPage;
