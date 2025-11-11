// app/routes/dashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router';
import { Settings, TrendingUp, Wallet } from 'lucide-react';
import type { Transaction, UserSettings } from '../types';
import Money from '~/components/Money';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState<Transaction[]>(
    []
  );
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserSettings();
      fetchRecentTransactions();
      fetchMonthlyTransactions(); // fetch current month
    }
  }, [user]);

  const getMonthDateRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  };

  const fetchMonthlyTransactions = async (monthDate: Date = new Date()) => {
    if (!user) return;

    const { start, end } = getMonthDateRange(monthDate);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', start.toISOString().split('T')[0])
        .lte('date', end.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setMonthlyTransactions(data || []);
    } catch (error) {
      console.error('Error fetching monthly transactions:', error);
    }
  };

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Create default settings if they don't exist
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user!.id,
            starting_balance: 0,
            starting_balance_locked: false,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setUserSettings(newSettings);
      } else {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Calculate current account balance: starting balance + all income - all expenses
  const calculateAccountBalance = () => {
    if (!userSettings) return 0;

    return userSettings.starting_balance + totalIncome - totalExpenses;
  };

  const accountBalance = calculateAccountBalance();
  const netWorth = accountBalance; // For now, account balance = net worth

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-monarch-neutral-800'>
            Welcome back, {user?.user_metadata?.name || 'User'}!
          </h1>
          <p className='text-monarch-neutral-600'>
            Budget{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <Link
          to='/profile'
          className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
          <Settings className='w-6 h-6' />
        </Link>
      </div>

      {/* Summary Cards - NOW WITH ACCOUNT BALANCE */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <p className='text-sm text-monarch-neutral-600'>
                Account Balance
              </p>
              <p className='text-2xl font-bold text-monarch-neutral-800'>
                <Money value={accountBalance} />
              </p>
            </div>
            <Wallet className='w-8 h-8 text-purple-500' />
          </div>
          {userSettings?.starting_balance_locked && (
            <p className='text-xs text-monarch-neutral-500 flex items-center gap-1'>
              🔒 Starting balance locked
            </p>
          )}
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <p className='text-sm text-monarch-neutral-600'>Income</p>
              <p className='text-2xl font-bold text-monarch-neutral-800'>
                <Money value={totalIncome} />
              </p>
            </div>
          </div>
          <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
            <div
              className='bg-monarch-green-500 h-2 rounded-full'
              style={{ width: '45%' }}></div>
          </div>
          <p className='text-sm text-monarch-neutral-600 mt-2'>This month</p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <p className='text-sm text-monarch-neutral-600'>Expenses</p>
              <p className='text-2xl font-bold text-monarch-neutral-800'>
                <Money value={totalExpenses} />
              </p>
            </div>
          </div>
          <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
            <div
              className='bg-monarch-orange-500 h-2 rounded-full'
              style={{ width: '35%' }}></div>
          </div>
          <p className='text-sm text-monarch-neutral-600 mt-2'>This month</p>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <p className='text-sm text-monarch-neutral-600'>Net Worth</p>
              <p className='text-2xl font-bold text-monarch-neutral-800'>
                <Money value={netWorth} />
              </p>
            </div>
          </div>
          <p className='text-sm text-monarch-green-600 flex items-center gap-1'>
            <TrendingUp className='w-4 h-4' />
            Current total
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className='bg-white rounded-xl p-6 shadow-sm'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Recent Transactions</h3>
          <Link
            to='/transactions'
            className='text-sm text-monarch-orange-600 hover:text-monarch-orange-700'>
            View all
          </Link>
        </div>
        <div className='space-y-3'>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className='flex justify-between items-center py-2'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-sm font-medium text-monarch-neutral-600'>
                      {transaction.merchant.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className='font-medium text-monarch-neutral-800'>
                      {transaction.merchant}
                    </p>
                    <p className='text-sm text-monarch-neutral-600'>
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${transaction.type === 'expense' ? 'text-monarch-red-600' : 'text-monarch-green-600'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  <Money value={Math.abs(transaction.amount)} />
                </p>
              </div>
            ))
          ) : (
            <p className='text-monarch-neutral-500 text-center py-4'>
              No transactions yet. Add your first transaction to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
