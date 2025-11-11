// app/routes/recurring.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { RecurringTransaction } from '../types';
import { Plus, Edit3, Trash2, Repeat, X, DollarSign } from 'lucide-react';
import Money from '~/components/Money';

export default function Recurring() {
  const { user } = useAuth();
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecurring, setEditingRecurring] =
    useState<RecurringTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecurring();
    }
  }, [user]);

  const fetchRecurring = async () => {
    try {
      const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRecurringTransactions(data || []);
    } catch (error) {
      console.error('Error fetching recurring transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecurring = async (recurringData: RecurringTransaction) => {
    try {
      if (editingRecurring?.id) {
        const { error } = await supabase
          .from('recurring_transactions')
          .update(recurringData)
          .eq('id', editingRecurring.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('recurring_transactions')
          .insert({ ...recurringData, user_id: user!.id });

        if (error) throw error;
      }

      fetchRecurring();
      setShowModal(false);
      setEditingRecurring(null);
    } catch (error) {
      console.error('Error saving recurring transaction:', error);
      alert('Failed to save recurring transaction');
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring transaction?'))
      return;

    try {
      const { error } = await supabase
        .from('recurring_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRecurring();
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
      alert('Failed to delete recurring transaction');
    }
  };

  const RecurringModal = ({ recurring, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({
      name: recurring?.name || '',
      amount: recurring?.amount || 0,
      frequency: recurring?.frequency || 'Monthly',
      next_due: recurring?.next_due || 'Today',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...recurring,
        ...formData,
      });
    };

    return (
      <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 w-96'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {recurring
                ? 'Edit Recurring Transaction'
                : 'Add Recurring Transaction'}
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
                placeholder='e.g., Netflix Subscription'
                required
              />
            </div>

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

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
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

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Next Due
              </label>
              <input
                type='text'
                value={formData.next_due}
                onChange={(e) =>
                  setFormData({ ...formData, next_due: e.target.value })
                }
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                placeholder='e.g., Today, In 3 days, Jan 15'
                required
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
                onClick={handleSubmit}
                className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
                {recurring ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  const totalMonthly = recurringTransactions
    .filter((t) => t.frequency === 'Monthly')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-monarch-neutral-800'>
            Recurring Transactions
          </h1>
          <p className='text-sm text-monarch-neutral-600 mt-1'>
            Total monthly: <Money value={totalMonthly} />
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRecurring(null);
            setShowModal(true);
          }}
          className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Recurring
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <div className='divide-y'>
          {recurringTransactions.length > 0 ? (
            recurringTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className='p-4 group hover:bg-monarch-neutral-50 overflow-hidden'>
                <div className='flex justify-between items-center overflow-hidden'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center mr-4'>
                      <Repeat className='w-5 h-5 text-monarch-neutral-600' />
                    </div>
                    <div>
                      <p className='font-medium text-monarch-neutral-800'>
                        {transaction.name}
                      </p>
                      <p className='text-sm text-monarch-neutral-600'>
                        {transaction.category}
                      </p>
                      <p className='text-sm text-monarch-neutral-600'>
                        {transaction.frequency}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='font-semibold text-monarch-neutral-800'>
                        <Money value={transaction.amount} />
                      </p>
                      <p className='text-sm text-monarch-neutral-600'>
                        {transaction.next_due}
                      </p>
                    </div>
                    <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={() => {
                          setEditingRecurring(transaction);
                          setShowModal(true);
                        }}
                        className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                        <Edit3 className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteRecurring(transaction.id!)}
                        className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-8 text-center text-monarch-neutral-500'>
              <Repeat className='w-16 h-16 text-monarch-neutral-300 mx-auto mb-4' />
              <p>
                No recurring transactions yet. Add your subscriptions and
                regular bills!
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <RecurringModal
          recurring={editingRecurring}
          onClose={() => {
            setShowModal(false);
            setEditingRecurring(null);
          }}
          onSave={handleSaveRecurring}
        />
      )}
    </div>
  );
}
