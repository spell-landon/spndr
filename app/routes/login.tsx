// app/routes/login.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    console.log('logging in...');
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      navigate('/');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Authentication failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-monarch-orange-500 rounded-2xl mb-4 shadow-lg'>
            <span className='text-3xl'>💰</span>
          </div>
          <h1 className='text-3xl font-bold text-monarch-neutral-800 mb-2'>
            Budget App
          </h1>
          <p className='text-monarch-neutral-600'>
            {isLogin
              ? 'Welcome back! Sign in to continue.'
              : 'Create your account to get started.'}
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-monarch-neutral-800'>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
          </div>

          <form className='space-y-5' onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                  Full Name
                </label>
                <div className='relative'>
                  <User className='w-5 h-5 absolute left-3 top-3.5 text-monarch-neutral-400' />
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500 transition-all ${
                      errors.name
                        ? 'border-monarch-red-500'
                        : 'border-monarch-neutral-300'
                    }`}
                    placeholder='John Doe'
                  />
                </div>
                {errors.name && (
                  <p className='text-monarch-red-500 text-sm mt-1'>
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Email Address
              </label>
              <div className='relative'>
                <Mail className='w-5 h-5 absolute left-3 top-3.5 text-monarch-neutral-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500 transition-all ${
                    errors.email
                      ? 'border-monarch-red-500'
                      : 'border-monarch-neutral-300'
                  }`}
                  placeholder='you@example.com'
                />
              </div>
              {errors.email && (
                <p className='text-monarch-red-500 text-sm mt-1'>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='w-5 h-5 absolute left-3 top-3.5 text-monarch-neutral-400' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500 transition-all ${
                    errors.password
                      ? 'border-monarch-red-500'
                      : 'border-monarch-neutral-300'
                  }`}
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3.5 text-monarch-neutral-400 hover:text-monarch-neutral-600'>
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-monarch-red-500 text-sm mt-1'>
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock className='w-5 h-5 absolute left-3 top-3.5 text-monarch-neutral-400' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500 transition-all ${
                      errors.confirmPassword
                        ? 'border-monarch-red-500'
                        : 'border-monarch-neutral-300'
                    }`}
                    placeholder='••••••••'
                  />
                </div>
                {errors.confirmPassword && (
                  <p className='text-monarch-red-500 text-sm mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {errors.submit && (
              <div className='bg-monarch-red-50 border border-monarch-red-200 text-monarch-red-700 px-4 py-3 rounded-lg'>
                {errors.submit}
              </div>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-monarch-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-monarch-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'>
              {isLoading ? (
                <>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-monarch-neutral-600'>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    confirmPassword: '',
                  });
                }}
                className='text-monarch-orange-600 hover:text-monarch-orange-700 font-semibold'>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
