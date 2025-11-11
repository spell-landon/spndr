// app/components/modals/CategoryModal.tsx
import React, { useEffect, useState, type FormEvent } from 'react';
import { X, DollarSign } from 'lucide-react';

export interface Category {
  id?: string;
  user_id?: string;
  parent_id?: string | null;
  name: string;
  budgeted: number;
  spent: number;
  remaining?: number;
  archived?: boolean;
  subcategories?: Category[];
}

interface CategoryModalProps {
  category?: Category | null;
  onClose: () => void;
  onSave: (categoryData: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Category>({
    id: category?.id,
    name: category?.name || '',
    budgeted: category?.budgeted ?? 0,
    spent: category?.spent ?? 0,
    remaining: category?.remaining,
  });

  useEffect(() => {
    if (category) {
      setForm({
        id: category.id,
        name: category.name,
        budgeted: category.budgeted,
        spent: category.spent,
        remaining: category.remaining,
        user_id: category.user_id,
      });
    } else {
      setForm({
        id: undefined,
        name: '',
        budgeted: 0,
        spent: 0,
      });
    }
  }, [category]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // For inserts: do NOT set id here — let DB generate UUID.
    const payload: Category = {
      // include id only when editing; omit when creating new
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      budgeted: form.budgeted,
      spent: form.spent,
      remaining: form.budgeted - form.spent,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-96 shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>
            {form.id ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onClose}
            className='text-monarch-neutral-400 hover:text-monarch-neutral-600'
            aria-label='Close'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-1'>
              Category Name
            </label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='w-full border border-monarch-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-1'>
              Budgeted Amount
            </label>
            <div className='relative'>
              <DollarSign className='w-4 h-4 absolute left-3 top-3 text-monarch-neutral-400' />
              <input
                type='number'
                step='0.01'
                value={form.budgeted}
                onChange={(e) =>
                  setForm({
                    ...form,
                    budgeted: parseFloat(e.target.value) || 0,
                  })
                }
                className='w-full pl-8 border border-monarch-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-1'>
              Spent
            </label>
            <div className='relative'>
              <DollarSign className='w-4 h-4 absolute left-3 top-3 text-monarch-neutral-400' />
              <input
                type='number'
                step='0.01'
                value={form.spent}
                onChange={(e) =>
                  setForm({ ...form, spent: parseFloat(e.target.value) || 0 })
                }
                className='w-full pl-8 border border-monarch-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
              />
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-monarch-neutral-300 rounded-lg hover:bg-monarch-neutral-50'>
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
              {form.id ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
