import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  CreditCard,
  Receipt,
  TrendingUp,
  BarChart3,
  PieChart,
  Repeat,
  Target,
  User as UserIcon,
} from 'lucide-react';

export default function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { path: '/', name: 'Dashboard', icon: Home },
    { path: '/transactions', name: 'Transactions', icon: Receipt },
    { path: '/budget', name: 'Budget', icon: PieChart },
    { path: '/goals', name: 'Goals', icon: Target },
    { path: '/recurring', name: 'Recurring', icon: Repeat },
  ];

  return (
    <div className='flex h-screen bg-gray-100'>
      <div className='w-64 bg-gray-50 h-screen p-4 border-r border-r-black/10 relative'>
        <div className='flex items-center mb-8'>
          <div className='w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3'>
            <span className='text-white font-bold'>💰</span>
          </div>
          <span className='font-semibold text-gray-800'>Budget App</span>
        </div>

        <nav className='space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                location.pathname === item.path
                  ? 'bg-orange-100 text-orange-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <item.icon className='w-5 h-5 mr-3' />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className='absolute bottom-4 left-4 right-4'>
          <Link
            to='/profile'
            className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
              location.pathname === '/profile'
                ? 'bg-orange-100 text-orange-600 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <UserIcon className='w-5 h-5 mr-3' />
            Profile
          </Link>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}
