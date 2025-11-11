// app/routes/profile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  Mail,
  LogOut,
  Bell,
  Shield,
  Palette,
  DollarSign,
  Lock,
  Unlock,
} from 'lucide-react';
import type { UserSettings } from '../types';
import Money from '~/components/Money';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [startingBalance, setStartingBalance] = useState<string>('0');
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
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
        setStartingBalance('0');
      } else {
        setUserSettings(data);
        setStartingBalance(data.starting_balance.toString());
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStartingBalance = async () => {
    try {
      const balance = parseFloat(startingBalance) || 0;

      const { error } = await supabase
        .from('user_settings')
        .update({ starting_balance: balance })
        .eq('user_id', user!.id);

      if (error) throw error;

      setUserSettings((prev) =>
        prev ? { ...prev, starting_balance: balance } : null
      );
      setIsEditingBalance(false);
      alert('Starting balance saved successfully!');
    } catch (error) {
      console.error('Error saving starting balance:', error);
      alert('Failed to save starting balance');
    }
  };

  const handleLockStartingBalance = async () => {
    if (!userSettings?.starting_balance_locked) {
      const confirmed = confirm(
        'Are you sure you want to lock the starting balance? This will prevent any changes and ensure accurate account balance calculations. This action cannot be easily undone.'
      );
      if (!confirmed) return;
    }

    try {
      const newLockedState = !userSettings?.starting_balance_locked;

      const { error } = await supabase
        .from('user_settings')
        .update({ starting_balance_locked: newLockedState })
        .eq('user_id', user!.id);

      if (error) throw error;

      setUserSettings((prev) =>
        prev ? { ...prev, starting_balance_locked: newLockedState } : null
      );
      alert(
        newLockedState
          ? 'Starting balance locked!'
          : 'Starting balance unlocked!'
      );
    } catch (error) {
      console.error('Error toggling lock:', error);
      alert('Failed to toggle lock');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-monarch-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold text-monarch-neutral-800 mb-6'>
        Profile & Settings
      </h1>

      {/* User Info Card */}
      <div className='bg-white rounded-xl shadow-sm border p-6 mb-6'>
        <div className='flex items-center mb-6'>
          <div className='w-20 h-20 bg-monarch-orange-100 rounded-full flex items-center justify-center mr-4'>
            <User className='w-10 h-10 text-monarch-orange-600' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-monarch-neutral-800'>
              {user?.user_metadata?.name || 'User'}
            </h2>
            <p className='text-monarch-neutral-600 flex items-center gap-2'>
              <Mail className='w-4 h-4' />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Starting Balance Section - NEW */}
      <div className='bg-gradient-to-r from-purple-50 to-monarch-blue-50 rounded-xl shadow-sm border border-purple-200 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-monarch-neutral-800 mb-4 flex items-center gap-2'>
          <DollarSign className='w-5 h-5 text-purple-600' />
          Starting Balance
        </h3>

        <div className='bg-white rounded-lg p-4 mb-4'>
          <p className='text-sm text-monarch-neutral-600 mb-3'>
            Set your starting account balance. This is used to calculate your
            current account balance based on all your transactions. Once locked,
            it ensures accurate balance tracking.
          </p>

          {isEditingBalance && !userSettings?.starting_balance_locked ? (
            <div className='space-y-3'>
              <div className='relative'>
                <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
                <input
                  type='number'
                  step='0.01'
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  placeholder='0.00'
                />
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={handleSaveStartingBalance}
                  className='flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700'>
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingBalance(false);
                    setStartingBalance(
                      userSettings?.starting_balance.toString() || '0'
                    );
                  }}
                  className='flex-1 bg-monarch-neutral-200 text-monarch-neutral-700 py-2 rounded-lg hover:bg-monarch-neutral-300'>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-3xl font-bold text-monarch-neutral-800'>
                  <Money value={userSettings?.starting_balance || 0} />
                </p>
                <p className='text-sm text-monarch-neutral-500 mt-1 flex items-center gap-1'>
                  {userSettings?.starting_balance_locked ? (
                    <>
                      <Lock className='w-4 h-4 text-monarch-green-600' />
                      <span className='text-monarch-green-600'>
                        Locked - Balance is protected
                      </span>
                    </>
                  ) : (
                    <>
                      <Unlock className='w-4 h-4 text-monarch-orange-600' />
                      <span className='text-monarch-orange-600'>
                        Unlocked - Can be edited
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className='flex gap-2'>
                {!userSettings?.starting_balance_locked && (
                  <button
                    onClick={() => setIsEditingBalance(true)}
                    className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'>
                    Edit
                  </button>
                )}
                <button
                  onClick={handleLockStartingBalance}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    userSettings?.starting_balance_locked
                      ? 'bg-monarch-orange-500 text-white hover:bg-monarch-orange-600'
                      : 'bg-monarch-green-600 text-white hover:bg-monarch-green-700'
                  }`}>
                  {userSettings?.starting_balance_locked ? (
                    <>
                      <Unlock className='w-4 h-4' />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className='w-4 h-4' />
                      Lock
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='bg-monarch-blue-50 border border-monarch-blue-200 rounded-lg p-3'>
          <p className='text-sm text-monarch-blue-800'>
            <strong>💡 Tip:</strong> Lock your starting balance after setting it
            to ensure your account balance stays accurate. All transactions will
            be calculated from this locked balance.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className='space-y-4'>
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-monarch-neutral-800 mb-4 flex items-center gap-2'>
            <Bell className='w-5 h-5' />
            Notifications
          </h3>
          <div className='space-y-3'>
            <label className='flex items-center justify-between'>
              <span className='text-monarch-neutral-700'>
                Email notifications
              </span>
              <input
                type='checkbox'
                className='w-5 h-5 text-monarch-orange-500 rounded'
                defaultChecked
              />
            </label>
            <label className='flex items-center justify-between'>
              <span className='text-monarch-neutral-700'>Budget alerts</span>
              <input
                type='checkbox'
                className='w-5 h-5 text-monarch-orange-500 rounded'
                defaultChecked
              />
            </label>
            <label className='flex items-center justify-between'>
              <span className='text-monarch-neutral-700'>Monthly reports</span>
              <input
                type='checkbox'
                className='w-5 h-5 text-monarch-orange-500 rounded'
              />
            </label>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-monarch-neutral-800 mb-4 flex items-center gap-2'>
            <Palette className='w-5 h-5' />
            Preferences
          </h3>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm text-monarch-neutral-700 mb-2'>
                Currency
              </label>
              <select className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>CAD ($)</option>
                <option>AUD ($)</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-monarch-neutral-700 mb-2'>
                Date Format
              </label>
              <select className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-monarch-neutral-700 mb-2'>
                First day of week
              </label>
              <select className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'>
                <option>Sunday</option>
                <option>Monday</option>
              </select>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-monarch-neutral-800 mb-4 flex items-center gap-2'>
            <Shield className='w-5 h-5' />
            Security
          </h3>
          <div className='space-y-3'>
            <button className='text-monarch-orange-600 hover:text-monarch-orange-700 font-medium'>
              Change Password
            </button>
            <div className='pt-2 border-t'>
              <p className='text-sm text-monarch-neutral-600 mb-2'>
                Two-Factor Authentication
              </p>
              <button className='text-sm text-monarch-neutral-700 hover:text-monarch-neutral-900 underline'>
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className='w-full bg-monarch-red-500 text-white py-3 rounded-lg font-semibold hover:bg-monarch-red-600 transition-colors flex items-center justify-center gap-2'>
          <LogOut className='w-5 h-5' />
          Sign Out
        </button>
      </div>
    </div>
  );
}
