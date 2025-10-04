import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, LogOut, Bell, Shield, Palette } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>
        Profile & Settings
      </h1>

      {/* User Info Card */}
      <div className='bg-white rounded-xl shadow-sm border border-black/10 p-6 mb-6'>
        <div className='flex items-center mb-6'>
          <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mr-4'>
            <User className='w-10 h-10 text-orange-600' />
          </div>
          <div>
            <h2 className='text-xl font-semibold text-gray-800'>
              {user?.name || user?.user_metadata?.name}
            </h2>
            <p className='text-gray-600 flex items-center gap-2'>
              <Mail className='w-4 h-4' />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className='space-y-4'>
        <div className='bg-white rounded-xl shadow-sm border border-black/10 p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Bell className='w-5 h-5' />
            Notifications
          </h3>
          <div className='space-y-3'>
            <label className='flex items-center justify-between'>
              <span className='text-gray-700'>Email notifications</span>
              <input
                type='checkbox'
                className='w-5 h-5 text-orange-500 rounded'
                defaultChecked
              />
            </label>
            <label className='flex items-center justify-between'>
              <span className='text-gray-700'>Budget alerts</span>
              <input
                type='checkbox'
                className='w-5 h-5 text-orange-500 rounded'
                defaultChecked
              />
            </label>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-black/10 p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Palette className='w-5 h-5' />
            Preferences
          </h3>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm text-gray-700 mb-2'>
                Currency
              </label>
              <select className='w-full p-2 border border-black/10 rounded-lg'>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-700 mb-2'>
                Date Format
              </label>
              <select className='w-full p-2 border border-black/10 rounded-lg'>
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-black/10 p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
            <Shield className='w-5 h-5' />
            Security
          </h3>
          <button className='text-orange-600 hover:text-orange-700 font-medium cursor-pointer'>
            Change Password
          </button>
        </div>

        <button
          onClick={handleLogout}
          className='w-full bg-transparent text-red-500 border border-red-500 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer'>
          <LogOut className='w-5 h-5' />
          Sign Out
        </button>
      </div>
    </div>
  );
}
