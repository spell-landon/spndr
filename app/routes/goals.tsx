// app/routes/goals.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Goal } from '../types';
import { Plus, Edit3, Trash2, Target, X, DollarSign } from 'lucide-react';
import Money from '~/components/Money';

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async (goalData: Goal) => {
    try {
      const progress =
        goalData.target > 0 ? (goalData.current / goalData.target) * 100 : 0;
      const dataToSave = { ...goalData, progress: Math.min(progress, 100) };

      if (editingGoal?.id) {
        const { error } = await supabase
          .from('goals')
          .update(dataToSave)
          .eq('id', editingGoal.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('goals')
          .insert({ ...dataToSave, user_id: user!.id });

        if (error) throw error;
      }

      fetchGoals();
      setShowModal(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal');
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);

      if (error) throw error;
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  };

  const GoalModal = ({ goal, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({
      name: goal?.name || '',
      target: goal?.target || 0,
      current: goal?.current || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...goal,
        ...formData,
      });
    };

    return (
      <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-6 w-96'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {goal ? 'Edit Goal' : 'Add Goal'}
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
                Goal Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                placeholder='e.g., Emergency Fund'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
                Target Amount
              </label>
              <div className='relative'>
                <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
                <input
                  type='number'
                  step='0.01'
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target: parseFloat(e.target.value) || 0,
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
                Current Amount
              </label>
              <div className='relative'>
                <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
                <input
                  type='number'
                  step='0.01'
                  value={formData.current}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current: parseFloat(e.target.value) || 0,
                    })
                  }
                  className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500'
                  placeholder='0.00'
                />
              </div>
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
                {goal ? 'Update' : 'Add'}
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

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-monarch-neutral-800'>Goals</h1>
        <button
          onClick={() => {
            setEditingGoal(null);
            setShowModal(true);
          }}
          className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Goal
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {goals.length > 0 ? (
          goals.map((goal) => {
            console.log(goal);
            return (
              <div
                key={goal.id}
                className='bg-white rounded-xl p-6 shadow-sm relative group'>
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='flex gap-1'>
                    <button
                      onClick={() => {
                        setEditingGoal(goal);
                        setShowModal(true);
                      }}
                      className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
                      <Edit3 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id!)}
                      className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-monarch-neutral-100 rounded-lg flex items-center justify-center mr-4'>
                    <Target className='w-6 h-6 text-monarch-neutral-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-monarch-neutral-800'>
                      {goal.name}
                    </h3>
                    <p className='text-sm text-monarch-neutral-600'>
                      <Money value={goal.current} /> of{' '}
                      <Money value={goal.target} />
                    </p>
                  </div>
                </div>

                {goal.target > 0 && (
                  <>
                    <div className='w-full bg-monarch-neutral-200 rounded-full h-2 mb-3'>
                      <div
                        className='bg-monarch-green-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${goal.progress}%` }}></div>
                    </div>
                    <p className='text-sm text-monarch-neutral-600'>
                      {goal.progress.toFixed(0)}% complete
                    </p>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className='col-span-3 text-center py-12'>
            <Target className='w-16 h-16 text-monarch-neutral-300 mx-auto mb-4' />
            <p className='text-monarch-neutral-500'>
              No goals yet. Create your first goal to start saving!
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <GoalModal
          goal={editingGoal}
          onClose={() => {
            setShowModal(false);
            setEditingGoal(null);
          }}
          onSave={handleSaveGoal}
        />
      )}
    </div>
  );
}
