import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Dashboard</h1>
      <p className='text-gray-600'>Welcome to your dashboard.</p>
    </div>
  );
}
