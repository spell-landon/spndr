// app/routes/transactions.tsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types';
import { Search, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { TransactionModal } from '~/components/modals/TransactionModal';
import Money from '~/components/Money';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, recurring_transactions(*)')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [transactions, searchTerm]
  );

  // Group transactions by date
  const transactionsByDate = useMemo(() => {
    return filteredTransactions.reduce(
      (acc: Record<string, Transaction[]>, tx) => {
        const dateKey = new Date(tx.date + 'T00:00:00').toLocaleDateString(
          undefined,
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        );
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(tx);
        return acc;
      },
      {}
    );
  }, [filteredTransactions]);

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-monarch-neutral-800'>
          Transactions
        </h1>
        <div className='flex gap-3'>
          <div className='relative'>
            <Search className='w-5 h-5 absolute left-3 top-2.5 text-monarch-neutral-400' />
            <input
              type='text'
              placeholder='Search transactions...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
            />
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowModal(true);
            }}
            className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
            <PlusCircle className='w-4 h-4' />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-black/10'>
        {Object.entries(transactionsByDate).length === 0 ? (
          <div className='p-8 text-center text-monarch-neutral-500'>
            No transactions found. Add your first transaction to get started!
          </div>
        ) : (
          Object.entries(transactionsByDate).map(([date, txs]) => (
            <div key={date}>
              {/* Date header */}
              <div className='p-4 bg-monarch-neutral-50 flex justify-between items-center font-semibold text-monarch-neutral-800 sticky top-0 z-10'>
                <span>{date}</span>
                <span className='text-monarch-neutral-600'>
                  <Money
                    value={txs.reduce((sum, t) => sum + Math.abs(t.amount), 0)}
                  />
                </span>
              </div>

              {/* Transactions for this date */}
              {txs.map((transaction) => (
                <div
                  key={transaction.id}
                  className='p-4 hover:bg-monarch-neutral-50 group grid grid-cols-[auto_1fr_1fr_1fr_2fr_1fr_auto] items-center gap-4'>
                  {/* Avatar */}
                  <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-medium text-monarch-neutral-600'>
                      {transaction.merchant.charAt(0)}
                    </span>
                  </div>

                  {/* Merchant Name */}
                  <div className='font-medium text-monarch-neutral-800'>
                    {transaction.merchant}
                  </div>

                  {/* Category */}
                  <div className='text-sm text-monarch-neutral-600'>
                    {transaction.category}
                  </div>

                  {/* Account */}
                  <div className='text-sm text-monarch-neutral-600'>
                    {transaction.account}
                  </div>

                  {/* Notes */}
                  <div className='text-sm text-monarch-neutral-600'>
                    {transaction.notes && (
                      <span>{transaction.notes.substring(0, 20)}</span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className='font-semibold text-right'>
                    <p
                      className={`${
                        transaction.type === 'expense'
                          ? 'text-monarch-red-600'
                          : 'text-monarch-green-600'
                      }`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      <Money value={Math.abs(transaction.amount)} />
                    </p>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end'>
                    <button
                      onClick={() => {
                        setEditingTransaction(transaction);
                        setShowModal(true);
                      }}
                      className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                      <Edit3 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id!)}
                      className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowModal(false);
            setEditingTransaction(null);
          }}
          onSave={fetchTransactions}
        />
      )}
    </div>
  );
}
