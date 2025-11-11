// app/components/modals/TransactionModal.tsx
import { useState } from 'react';
import { useCategories } from '~/contexts/CategoriesContext';
import { supabase } from '~/lib/supabase';
import { useAuth } from '~/contexts/AuthContext';
import {
  Search,
  Calendar,
  Filter,
  PlusCircle,
  X,
  DollarSign,
  Edit3,
  Trash2,
  Repeat,
  Info,
} from 'lucide-react';

export const TransactionModal = ({ transaction, onClose, onSave }: any) => {
  const { user } = useAuth();
  const { incomeCategories, expenseCategories, addCategory } = useCategories();
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  const recurring = transaction?.recurring_transactions;

  const [formData, setFormData] = useState({
    merchant: transaction?.merchant || '',
    category: transaction?.category || '',
    amount: transaction ? Math.abs(transaction.amount) : 0,
    date: transaction?.date || new Date().toISOString().split('T')[0],
    account: transaction?.account || 'Checking Account',
    type: transaction?.type || ('expense' as 'income' | 'expense'),
    notes: transaction?.notes || '',
    isRecurring: !!transaction?.recurring_transaction_id,
    recurringFrequency: recurring?.frequency || 'Monthly',
    recurringDayOfMonth:
      recurring?.next_due?.match(/day (\d+)/)?.[1] || new Date().getDate(),
    recurringDayOfWeek: new Date().getDay(),
    recurringEndDate: '',
  });

  const categories =
    formData.type === 'income'
      ? incomeCategories.flatMap((cat) => [cat, ...(cat.subcategories || [])])
      : expenseCategories.flatMap((cat) => [cat, ...(cat.subcategories || [])]);

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsAddingCategory(true);
    try {
      await addCategory({
        name: newCategoryName.trim(),
        type: formData.type,
        parent_id: null,
        archived: false,
        sort_order: 0,
      });

      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (error) {
      alert('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const calculateNextDue = () => {
    const date = new Date(formData.date);

    switch (formData.recurringFrequency) {
      case 'Daily':
        date.setDate(date.getDate() + 1);
        return 'Tomorrow';
      case 'Weekly':
        date.setDate(date.getDate() + 7);
        return `In 7 days (${date.toLocaleDateString()})`;
      case 'Every 2 weeks':
        date.setDate(date.getDate() + 14);
        return `In 14 days (${date.toLocaleDateString()})`;
      case 'Monthly':
        date.setMonth(date.getMonth() + 1);
        return `Next month on day ${formData.recurringDayOfMonth}`;
      case 'Quarterly':
        date.setMonth(date.getMonth() + 3);
        return `In 3 months (${date.toLocaleDateString()})`;
      case 'Yearly':
        date.setFullYear(date.getFullYear() + 1);
        return `In 1 year (${date.toLocaleDateString()})`;
      default:
        return 'N/A';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const isEditing = !!transaction;
      const hasRecurring = !!transaction?.recurring_transaction_id;
      let recurringTransactionId = transaction?.recurring_transaction_id;

      // Recurring Transaction Logic
      if (formData.isRecurring) {
        const recurringData = {
          user_id: user.id,
          name: formData.merchant || 'Recurring Transaction',
          amount: formData.amount || 0,
          frequency: formData.recurringFrequency,
          next_due:
            formData.recurringFrequency === 'Weekly'
              ? `Next ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][formData.recurringDayOfWeek]}`
              : `Next month on day ${formData.recurringDayOfMonth}`,
          is_active: true,
        };

        if (hasRecurring) {
          const { error: updateError } = await supabase
            .from('recurring_transactions')
            .update(recurringData)
            .eq('id', recurringTransactionId);
          if (updateError) throw updateError;
        } else {
          const { data: newRecurring, error: insertError } = await supabase
            .from('recurring_transactions')
            .insert([recurringData])
            .select()
            .single();
          if (insertError) throw insertError;
          recurringTransactionId = newRecurring.id;
        }
      } else if (hasRecurring && !formData.isRecurring) {
        const { error: deactivateError } = await supabase
          .from('recurring_transactions')
          .update({ is_active: false })
          .eq('id', recurringTransactionId);
        if (deactivateError) throw deactivateError;
        recurringTransactionId = null;
      }

      const transactionData = {
        user_id: user.id,
        merchant: formData.merchant,
        category: formData.category,
        amount:
          formData.type === 'income'
            ? Math.abs(formData.amount)
            : -Math.abs(formData.amount),
        date: formData.date,
        account: formData.account,
        type: formData.type,
        notes: formData.notes,
        recurring_transaction_id: recurringTransactionId,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('transactions')
          .insert([transactionData]);
        if (insertError) throw insertError;
      }

      onSave?.();
      onClose?.();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Something went wrong saving this transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form Fields */}
        <div className='space-y-4'>
          {/* Merchant */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Merchant
            </label>
            <input
              type='text'
              value={formData.merchant}
              onChange={(e) =>
                setFormData({ ...formData, merchant: e.target.value })
              }
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
              placeholder='Enter merchant name'
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Type
            </label>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: '' });
                  setShowNewCategoryInput(false);
                }}
                className={`flex-1 py-2 rounded-lg ${
                  formData.type === 'expense'
                    ? 'bg-monarch-red-500 text-white'
                    : 'bg-monarch-neutral-200 text-monarch-neutral-700'
                }`}>
                Expense
              </button>
              <button
                type='button'
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: '' });
                  setShowNewCategoryInput(false);
                }}
                className={`flex-1 py-2 rounded-lg ${
                  formData.type === 'income'
                    ? 'bg-monarch-green-500 text-white'
                    : 'bg-monarch-neutral-200 text-monarch-neutral-700'
                }`}>
                Income
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Amount
            </label>
            <div className='relative'>
              <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
              <input
                type='number'
                step='0.01'
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                placeholder='0.00'
                required
              />
            </div>
          </div>

          {/* Category with Add New */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Category
            </label>

            {!showNewCategoryInput ? (
              <select
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === '__add_new__') {
                    setShowNewCategoryInput(true);
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                  }
                }}
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                required={!showNewCategoryInput}>
                <option value=''>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.parent_id ? `  └─ ${cat.name}` : cat.name}
                  </option>
                ))}
                <option
                  value='__add_new__'
                  className='text-monarch-orange-600 font-medium'>
                  + Add New Category
                </option>
              </select>
            ) : (
              <div className='space-y-2'>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewCategory();
                      }
                      if (e.key === 'Escape') {
                        setShowNewCategoryInput(false);
                        setNewCategoryName('');
                      }
                    }}
                    className='flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                    placeholder='Enter new category name'
                    autoFocus
                  />
                  <button
                    type='button'
                    onClick={handleAddNewCategory}
                    disabled={isAddingCategory || !newCategoryName.trim()}
                    className='px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600 disabled:opacity-50'>
                    {isAddingCategory ? (
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    ) : (
                      'Add'
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategoryName('');
                    }}
                    className='px-3 py-2 text-monarch-neutral-600 hover:bg-monarch-neutral-100 rounded-lg'>
                    <X className='w-5 h-5' />
                  </button>
                </div>
                <p className='text-sm text-monarch-neutral-500'>
                  Press Enter to add or Esc to cancel
                </p>
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Date
            </label>
            <input
              type='date'
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
              required
            />
          </div>

          {/* Account */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Account
            </label>
            <input
              type='text'
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
              placeholder='Checking Account'
            />
          </div>

          {/* Recurring Toggle */}
          <div className='border-t border-black/10 pt-4'>
            <label className='flex items-center justify-between cursor-pointer'>
              <div className='flex items-center gap-2'>
                <Repeat className='w-5 h-5 text-monarch-neutral-600' />
                <span className='text-sm font-medium text-monarch-neutral-700'>
                  Make this a recurring transaction
                </span>
              </div>
              <input
                type='checkbox'
                checked={formData.isRecurring}
                onChange={(e) =>
                  setFormData({ ...formData, isRecurring: e.target.checked })
                }
                className='w-5 h-5 text-monarch-orange-500 rounded'
              />
            </label>
          </div>

          {/* Recurring Options */}
          {formData.isRecurring && (
            <div className='bg-orange-50 border border-monarch-orange-200 rounded-lg p-4 space-y-4'>
              <div className='flex items-start gap-2 text-sm text-monarch-orange-800'>
                <Info className='w-4 h-4 mt-0.5 flex-shrink-0' />
                <p>
                  This transaction will be automatically tracked as recurring
                  and appear on your Recurring page.
                </p>
              </div>

              <div>
                <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                  Frequency
                </label>
                <select
                  value={formData.recurringFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurringFrequency: e.target.value,
                    })
                  }
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
                  <option value='Daily'>Daily</option>
                  <option value='Weekly'>Weekly</option>
                  <option value='Every 2 weeks'>Every 2 weeks</option>
                  <option value='Monthly'>Monthly</option>
                  <option value='Quarterly'>Quarterly</option>
                  <option value='Yearly'>Yearly</option>
                </select>
              </div>

              {formData.recurringFrequency === 'Monthly' && (
                <div>
                  <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                    Day of Month
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='31'
                    value={formData.recurringDayOfMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurringDayOfMonth: parseInt(e.target.value) || 1,
                      })
                    }
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                  />
                  <p className='text-xs text-monarch-neutral-500 mt-1'>
                    Transaction will recur on day {formData.recurringDayOfMonth}{' '}
                    of each month
                  </p>
                </div>
              )}

              {formData.recurringFrequency === 'Weekly' && (
                <div>
                  <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                    Day of Week
                  </label>
                  <select
                    value={formData.recurringDayOfWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurringDayOfWeek: parseInt(e.target.value),
                      })
                    }
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
                    <option value='0'>Sunday</option>
                    <option value='1'>Monday</option>
                    <option value='2'>Tuesday</option>
                    <option value='3'>Wednesday</option>
                    <option value='4'>Thursday</option>
                    <option value='5'>Friday</option>
                    <option value='6'>Saturday</option>
                  </select>
                </div>
              )}

              <div className='bg-white rounded p-3'>
                <p className='text-sm text-monarch-neutral-600'>
                  <strong>Next occurrence:</strong> {calculateNextDue()}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
              rows={3}
              placeholder='Add any notes...'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 text-monarch-neutral-600 border rounded-lg hover:bg-monarch-neutral-50'>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.category || loading}
              className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'>
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
