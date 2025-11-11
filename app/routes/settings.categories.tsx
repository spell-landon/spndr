// app/routes/settings.categories.tsx
import { useState } from 'react';
import { useCategories, type Category } from '../contexts/CategoriesContext';
import {
  Plus,
  Edit3,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  X,
  Archive,
} from 'lucide-react';

export default function CategoriesSettings() {
  const {
    incomeCategories,
    expenseCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<'income' | 'expense'>(
    'expense'
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const CategoryModal = ({
    category,
    onClose,
    type,
  }: {
    category: Category | null;
    onClose: () => void;
    type: 'income' | 'expense';
  }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      type: category?.type || type,
      parent_id: category?.parent_id || null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (category?.id) {
          await updateCategory(category.id, formData);
        } else {
          await addCategory({
            ...formData,
            archived: false,
            sort_order: 0,
          });
        }
        onClose();
      } catch (error) {
        alert('Failed to save category');
      }
    };

    return (
      <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 w-96'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {category ? 'Edit Category' : 'Add Category'}
            </h2>
            <button
              onClick={onClose}
              className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
              <X className='w-6 h-6' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Category Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                placeholder='e.g., Groceries'
                required
                autoFocus
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='flex-1 px-4 py-2 text-monarch-neutral-600 border rounded-lg hover:bg-monarch-neutral-50'>
                Cancel
              </button>
              <button
                type='submit'
                className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
                {category ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderCategoryList = (
    categories: Category[],
    type: 'income' | 'expense'
  ) => (
    <div className='space-y-2'>
      {categories.map((category) => (
        <div
          key={category.id}
          className='bg-white border border-black/10 rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='font-medium text-monarch-neutral-800'>
                {category.name}
              </span>
              {category.subcategories && category.subcategories.length > 0 && (
                <span className='text-sm text-monarch-neutral-500'>
                  ({category.subcategories.length} subcategories)
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setCategoryType(type);
                  setShowModal(true);
                }}
                className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                <Edit3 className='w-4 h-4' />
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-monarch-neutral-800'>
          Category Management
        </h1>
        <p className='text-monarch-neutral-600 mt-1'>
          Manage your income and expense categories. These will be used
          throughout the app.
        </p>
      </div>

      {/* Income Categories */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-monarch-neutral-800'>
            Income Categories
          </h2>
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryType('income');
              setShowModal(true);
            }}
            className='bg-monarch-green-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-green-600 flex items-center gap-2'>
            <Plus className='w-4 h-4' />
            Add Income Category
          </button>
        </div>
        {renderCategoryList(incomeCategories, 'income')}
      </div>

      {/* Expense Categories */}
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-monarch-neutral-800'>
            Expense Categories
          </h2>
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryType('expense');
              setShowModal(true);
            }}
            className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
            <Plus className='w-4 h-4' />
            Add Expense Category
          </button>
        </div>
        {renderCategoryList(expenseCategories, 'expense')}
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          type={categoryType}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}
