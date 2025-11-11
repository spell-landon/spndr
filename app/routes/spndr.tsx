import type { Route } from './+types/home';
import { Welcome } from '../components/welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className='h-full w-full justify-center align-center'>
      <p>SPNDR</p>
    </div>
  );
}

// import React, { useState } from 'react';
// import {
//   DollarSign,
//   TrendingUp,
//   PlusCircle,
//   Settings,
//   Home,
//   CreditCard,
//   BarChart3,
//   Target,
//   Repeat,
//   PieChart,
//   Receipt,
//   Search,
//   Calendar,
//   Filter,
//   X,
//   Edit3,
//   Trash2,
//   Archive,
//   GripVertical,
//   ChevronDown,
//   ChevronUp,
//   Plus,
// } from 'lucide-react';

// const BudgetApp = () => {
//   console.log('SPNDR');
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showTransactionModal, setShowTransactionModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);
//   const [showCategoryModal, setShowCategoryModal] = useState(false);
//   const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [editingSubcategory, setEditingSubcategory] = useState(null);
//   const [expandedCategories, setExpandedCategories] = useState({});

//   const [transactions, setTransactions] = useState([
//     {
//       id: 1,
//       merchant: 'Austin TX US',
//       category: 'Groceries',
//       amount: -91.66,
//       date: '2025-04-05',
//       account: 'Checking Account (...5828)',
//       type: 'expense',
//     },
//     {
//       id: 2,
//       merchant: 'World Vision',
//       category: 'Travel & Vacation',
//       amount: -195.0,
//       date: '2025-04-04',
//       account: 'Checking Account (...5828)',
//       type: 'expense',
//     },
//     {
//       id: 3,
//       merchant: 'The Gramercy Payroll',
//       category: 'Paychecks',
//       amount: 192.59,
//       date: '2025-04-03',
//       account: 'Checking Account (...5828)',
//       type: 'income',
//     },
//     {
//       id: 4,
//       merchant: 'Plex Media Server',
//       category: 'Streaming & Subscriptions',
//       amount: -5.4,
//       date: '2025-04-03',
//       account: 'Checking Account (...5828)',
//       type: 'expense',
//     },
//     {
//       id: 5,
//       merchant: 'Interest Paid',
//       category: 'Savings Interest',
//       amount: 81.64,
//       date: '2025-04-03',
//       account: 'Savings Account (...5817)',
//       type: 'income',
//     },
//   ]);

//   const [budgetCategories, setBudgetCategories] = useState([
//     {
//       id: 1,
//       name: 'Gifts & Donations',
//       budgeted: 479,
//       spent: 0,
//       remaining: 965,
//       archived: false,
//       subcategories: [
//         {
//           id: 1,
//           name: 'Charity',
//           budgeted: 284,
//           spent: 0,
//           remaining: 652,
//           archived: false,
//         },
//         {
//           id: 2,
//           name: 'Gifts',
//           budgeted: 0,
//           spent: 0,
//           remaining: 118,
//           archived: false,
//         },
//         {
//           id: 3,
//           name: 'World Vision',
//           budgeted: 195,
//           spent: 0,
//           remaining: 195,
//           archived: false,
//         },
//       ],
//     },
//     {
//       id: 2,
//       name: 'Auto & Transport',
//       budgeted: 227,
//       spent: 0,
//       remaining: 1110,
//       archived: false,
//       subcategories: [
//         {
//           id: 4,
//           name: 'Gas',
//           budgeted: 85,
//           spent: 0,
//           remaining: 80,
//           archived: false,
//         },
//         {
//           id: 5,
//           name: 'Auto Maintenance',
//           budgeted: 30,
//           spent: 0,
//           remaining: 667,
//           archived: false,
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: 'Housing',
//       budgeted: 1773,
//       spent: 1763,
//       remaining: 10,
//       archived: false,
//       subcategories: [
//         {
//           id: 6,
//           name: 'Rent',
//           budgeted: 1763,
//           spent: 1763,
//           remaining: 0,
//           archived: false,
//         },
//       ],
//     },
//   ]);

//   const [goals, setGoals] = useState([
//     {
//       id: 1,
//       name: 'Moving Expenses',
//       target: 7886,
//       current: 7886,
//       progress: 100,
//     },
//     { id: 2, name: 'Car', target: 0, current: 0, progress: 0 },
//     { id: 3, name: 'Lasik', target: 0, current: 0, progress: 0 },
//   ]);

//   const [recurringTransactions, setRecurringTransactions] = useState([
//     {
//       id: 1,
//       name: 'Apple iCloud - Landon (2TB)',
//       amount: 9.99,
//       frequency: 'Monthly',
//       nextDue: 'Today',
//     },
//     {
//       id: 2,
//       name: 'Plex Media Server',
//       amount: 5.4,
//       frequency: 'Monthly',
//       nextDue: 'Today',
//     },
//     {
//       id: 3,
//       name: 'Apple iCloud - Emily',
//       amount: 2.99,
//       frequency: 'Monthly',
//       nextDue: 'In 3 days',
//     },
//   ]);

//   const [showGoalModal, setShowGoalModal] = useState(false);
//   const [editingGoal, setEditingGoal] = useState(null);
//   const [showRecurringModal, setShowRecurringModal] = useState(false);
//   const [editingRecurring, setEditingRecurring] = useState(null);

//   // Calculate totals
//   const totalIncome = transactions
//     .filter((t) => t.type === 'income')
//     .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//   const totalExpenses = transactions
//     .filter((t) => t.type === 'expense')
//     .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//   const netWorth = 43191;
//   const monthlySpending = 2221.26;

//   const Sidebar = () => (
//     <div className='w-64 bg-monarch-neutral-50 h-screen p-4 border-r'>
//       <div className='flex items-center mb-8'>
//         <div className='w-8 h-8 bg-monarch-orange-500 rounded-lg flex items-center justify-center mr-3'>
//           <span className='text-white font-bold'>M</span>
//         </div>
//         <span className='font-semibold text-monarch-neutral-800'>Budget App</span>
//       </div>

//       <nav className='space-y-2'>
//         {[
//           { id: 'dashboard', name: 'Dashboard', icon: Home },
//           { id: 'accounts', name: 'Accounts', icon: CreditCard },
//           { id: 'transactions', name: 'Transactions', icon: Receipt },
//           { id: 'cashflow', name: 'Cash Flow', icon: TrendingUp },
//           { id: 'reports', name: 'Reports', icon: BarChart3 },
//           { id: 'budget', name: 'Budget', icon: PieChart },
//           { id: 'recurring', name: 'Recurring', icon: Repeat },
//           { id: 'goals', name: 'Goals', icon: Target },
//         ].map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
//               activeTab === item.id
//                 ? 'bg-orange-100 text-monarch-orange-600 font-medium'
//                 : 'text-monarch-neutral-600 hover:bg-monarch-neutral-100'
//             }`}>
//             <item.icon className='w-5 h-5 mr-3' />
//             {item.name}
//             {item.id === 'recurring' && (
//               <span className='ml-auto bg-monarch-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
//                 1
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>
//     </div>
//   );

//   const GoalModal = ({ goal, onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//       name: goal?.name || '',
//       target: goal?.target || 0,
//       current: goal?.current || 0,
//     });

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       const progress =
//         formData.target > 0 ? (formData.current / formData.target) * 100 : 0;
//       onSave({
//         ...goal,
//         ...formData,
//         progress: Math.min(progress, 100),
//         id: goal?.id || Date.now(),
//       });
//       onClose();
//     };

//     return (
//       <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//         <div className='bg-white rounded-lg p-6 w-96'>
//           <div className='flex justify-between items-center mb-6'>
//             <h2 className='text-xl font-semibold'>
//               {goal?.id ? 'Edit Goal' : 'Add Goal'}
//             </h2>
//             <button
//               onClick={onClose}
//               className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
//               <X className='w-6 h-6' />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Goal Name
//               </label>
//               <input
//                 type='text'
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 placeholder='Enter goal name'
//                 required
//               />
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Target Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.target}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       target: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Current Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.current}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       current: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                 />
//               </div>
//             </div>

//             <div className='flex gap-3 pt-4'>
//               <button
//                 type='button'
//                 onClick={onClose}
//                 className='flex-1 px-4 py-2 text-monarch-neutral-600 border border-monarch-neutral-300 rounded-lg hover:bg-monarch-neutral-50'>
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
//                 {goal?.id ? 'Update' : 'Add'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const RecurringModal = ({ recurring, onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//       name: recurring?.name || '',
//       amount: recurring?.amount || 0,
//       frequency: recurring?.frequency || 'Monthly',
//       nextDue: recurring?.nextDue || 'Today',
//     });

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave({
//         ...recurring,
//         ...formData,
//         id: recurring?.id || Date.now(),
//       });
//       onClose();
//     };

//     return (
//       <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//         <div className='bg-white rounded-lg p-6 w-96'>
//           <div className='flex justify-between items-center mb-6'>
//             <h2 className='text-xl font-semibold'>
//               {recurring?.id
//                 ? 'Edit Recurring Transaction'
//                 : 'Add Recurring Transaction'}
//             </h2>
//             <button
//               onClick={onClose}
//               className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
//               <X className='w-6 h-6' />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Name
//               </label>
//               <input
//                 type='text'
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 placeholder='Enter transaction name'
//                 required
//               />
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.amount}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       amount: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Frequency
//               </label>
//               <select
//                 value={formData.frequency}
//                 onChange={(e) =>
//                   setFormData({ ...formData, frequency: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'>
//                 <option value='Daily'>Daily</option>
//                 <option value='Weekly'>Weekly</option>
//                 <option value='Every 2 weeks'>Every 2 weeks</option>
//                 <option value='Monthly'>Monthly</option>
//                 <option value='Quarterly'>Quarterly</option>
//                 <option value='Yearly'>Yearly</option>
//               </select>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Next Due
//               </label>
//               <input
//                 type='text'
//                 value={formData.nextDue}
//                 onChange={(e) =>
//                   setFormData({ ...formData, nextDue: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 placeholder='e.g., Today, In 3 days'
//                 required
//               />
//             </div>

//             <div className='flex gap-3 pt-4'>
//               <button
//                 type='button'
//                 onClick={onClose}
//                 className='flex-1 px-4 py-2 text-monarch-neutral-600 border border-monarch-neutral-300 rounded-lg hover:bg-monarch-neutral-50'>
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
//                 {recurring?.id ? 'Update' : 'Add'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const CategoryModal = ({
//     category,
//     subcategory,
//     onClose,
//     onSave,
//     parentCategoryId,
//   }) => {
//     const [formData, setFormData] = useState({
//       name: category?.name || subcategory?.name || '',
//       budgeted: category?.budgeted || subcategory?.budgeted || 0,
//       spent: category?.spent || subcategory?.spent || 0,
//     });

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       const remaining = formData.budgeted - formData.spent;
//       onSave(
//         {
//           ...(category || subcategory),
//           ...formData,
//           remaining,
//           id: category?.id || subcategory?.id || Date.now(),
//           archived: false,
//         },
//         parentCategoryId
//       );
//       onClose();
//     };

//     return (
//       <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//         <div className='bg-white rounded-lg p-6 w-96'>
//           <div className='flex justify-between items-center mb-6'>
//             <h2 className='text-xl font-semibold'>
//               {category
//                 ? category.id
//                   ? 'Edit Category'
//                   : 'Add Category'
//                 : subcategory?.id
//                   ? 'Edit Subcategory'
//                   : 'Add Subcategory'}
//             </h2>
//             <button
//               onClick={onClose}
//               className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
//               <X className='w-6 h-6' />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Name
//               </label>
//               <input
//                 type='text'
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 placeholder='Enter category name'
//                 required
//               />
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Budgeted Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.budgeted}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       budgeted: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Spent Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.spent}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       spent: parseFloat(e.target.value) || 0,
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                 />
//               </div>
//             </div>

//             <div className='flex gap-3 pt-4'>
//               <button
//                 type='button'
//                 onClick={onClose}
//                 className='flex-1 px-4 py-2 text-monarch-neutral-600 border border-monarch-neutral-300 rounded-lg hover:bg-monarch-neutral-50'>
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
//                 {category?.id || subcategory?.id ? 'Update' : 'Add'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const TransactionModal = ({ transaction, onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//       merchant: transaction?.merchant || '',
//       category: transaction?.category || 'Groceries',
//       amount: Math.abs(transaction?.amount) || 0,
//       date: transaction?.date || new Date().toISOString().split('T')[0],
//       notes: '',
//       tags: '',
//     });

//     const categories = [
//       'Groceries',
//       'Travel & Vacation',
//       'Paychecks',
//       'Streaming & Subscriptions',
//       'Savings Interest',
//       'Restaurants & Bars',
//       'Gas',
//       'Rent',
//       'Utilities',
//       'Entertainment',
//     ];

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave({
//         ...transaction,
//         ...formData,
//         amount:
//           transaction?.type === 'expense'
//             ? -Math.abs(formData.amount)
//             : Math.abs(formData.amount),
//       });
//       onClose();
//     };

//     return (
//       <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
//         <div className='bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto'>
//           <div className='flex justify-between items-center mb-6'>
//             <h2 className='text-xl font-semibold'>
//               {transaction ? 'Edit Transaction' : 'Add Transaction'}
//             </h2>
//             <button
//               onClick={onClose}
//               className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
//               <X className='w-6 h-6' />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className='space-y-4'>
//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Merchant
//               </label>
//               <input
//                 type='text'
//                 value={formData.merchant}
//                 onChange={(e) =>
//                   setFormData({ ...formData, merchant: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 placeholder='Enter merchant name'
//                 required
//               />
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Amount
//               </label>
//               <div className='relative'>
//                 <DollarSign className='w-5 h-5 absolute left-3 top-3 text-monarch-neutral-400' />
//                 <input
//                   type='number'
//                   step='0.01'
//                   value={formData.amount}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       amount: parseFloat(e.target.value),
//                     })
//                   }
//                   className='w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                   placeholder='0.00'
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Category
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) =>
//                   setFormData({ ...formData, category: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className='block text-sm font-medium text-monarch-neutral-700 mb-2'>
//                 Date
//               </label>
//               <input
//                 type='date'
//                 value={formData.date}
//                 onChange={(e) =>
//                   setFormData({ ...formData, date: e.target.value })
//                 }
//                 className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//                 required
//               />
//             </div>

//             <div className='flex gap-3 pt-4'>
//               <button
//                 type='button'
//                 onClick={onClose}
//                 className='flex-1 px-4 py-2 text-monarch-neutral-600 border border-monarch-neutral-300 rounded-lg hover:bg-monarch-neutral-50'>
//                 Cancel
//               </button>
//               <button
//                 type='submit'
//                 className='flex-1 px-4 py-2 bg-monarch-orange-500 text-white rounded-lg hover:bg-monarch-orange-600'>
//                 {transaction ? 'Update' : 'Add'} Transaction
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const Dashboard = () => (
//     <div className='p-6'>
//       <div className='flex justify-between items-center mb-6'>
//         <div>
//           <h1 className='text-2xl font-bold text-monarch-neutral-800'>
//             Welcome back, Landon!
//           </h1>
//           <p className='text-monarch-neutral-600'>Budget April 2025</p>
//         </div>
//         <button className='text-monarch-neutral-500 hover:text-monarch-neutral-700'>
//           <Settings className='w-6 h-6' />
//         </button>
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
//         <div className='bg-white rounded-xl p-6 shadow-sm border'>
//           <div className='flex justify-between items-start mb-4'>
//             <div>
//               <p className='text-sm text-monarch-neutral-600'>Income</p>
//               <p className='text-2xl font-bold text-monarch-neutral-800'>
//                 ${totalIncome.toFixed(2)} earned
//               </p>
//             </div>
//           </div>
//           <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
//             <div
//               className='bg-monarch-green-500 h-2 rounded-full'
//               style={{ width: '15%' }}></div>
//           </div>
//           <p className='text-sm text-monarch-green-600 mt-2'>
//             ${(5500 - totalIncome).toFixed(2)} remaining
//           </p>
//         </div>

//         <div className='bg-white rounded-xl p-6 shadow-sm border'>
//           <div className='flex justify-between items-start mb-4'>
//             <div>
//               <p className='text-sm text-monarch-neutral-600'>Expenses</p>
//               <p className='text-2xl font-bold text-monarch-neutral-800'>
//                 ${totalExpenses.toFixed(2)} spent
//               </p>
//             </div>
//           </div>
//           <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
//             <div
//               className='bg-monarch-orange-500 h-2 rounded-full'
//               style={{ width: '35%' }}></div>
//           </div>
//           <p className='text-sm text-monarch-green-600 mt-2'>
//             ${(4232 - totalExpenses).toFixed(2)} remaining
//           </p>
//         </div>

//         <div className='bg-white rounded-xl p-6 shadow-sm border'>
//           <div className='flex justify-between items-start mb-4'>
//             <div>
//               <p className='text-sm text-monarch-neutral-600'>Net Worth</p>
//               <p className='text-2xl font-bold text-monarch-neutral-800'>
//                 ${netWorth.toLocaleString()}
//               </p>
//             </div>
//           </div>
//           <p className='text-sm text-monarch-green-600'>+$1,778.35 (4.3%)</p>
//         </div>
//       </div>

//       <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
//         <div className='bg-white rounded-xl p-6 shadow-sm border'>
//           <div className='flex justify-between items-center mb-4'>
//             <h3 className='text-lg font-semibold'>Spending</h3>
//             <p className='text-sm text-monarch-neutral-600'>
//               ${monthlySpending} this month
//             </p>
//           </div>
//           <div className='h-48 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg flex items-center justify-center'>
//             <div className='text-center text-sm text-monarch-neutral-600'>
//               📊 Spending Chart
//             </div>
//           </div>
//         </div>

//         <div className='bg-white rounded-xl p-6 shadow-sm border'>
//           <div className='flex justify-between items-center mb-4'>
//             <h3 className='text-lg font-semibold'>Transactions</h3>
//             <button
//               onClick={() => setActiveTab('transactions')}
//               className='text-sm text-monarch-orange-600 hover:text-monarch-orange-700'>
//               All transactions
//             </button>
//           </div>
//           <div className='space-y-3'>
//             {transactions.slice(0, 5).map((transaction) => (
//               <div
//                 key={transaction.id}
//                 className='flex justify-between items-center py-2'>
//                 <div className='flex items-center'>
//                   <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center mr-3'>
//                     <span className='text-sm font-medium text-monarch-neutral-600'>
//                       {transaction.merchant.charAt(0)}
//                     </span>
//                   </div>
//                   <div>
//                     <p className='font-medium text-monarch-neutral-800'>
//                       {transaction.merchant}
//                     </p>
//                     <p className='text-sm text-monarch-neutral-600'>
//                       {transaction.category}
//                     </p>
//                   </div>
//                 </div>
//                 <p
//                   className={`font-semibold ${transaction.amount < 0 ? 'text-monarch-red-600' : 'text-monarch-green-600'}`}>
//                   {transaction.amount < 0 ? '-' : '+'}$
//                   {Math.abs(transaction.amount).toFixed(2)}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const TransactionsPage = () => (
//     <div className='p-6'>
//       <div className='flex justify-between items-center mb-6'>
//         <h1 className='text-2xl font-bold text-monarch-neutral-800'>Transactions</h1>
//         <div className='flex gap-3'>
//           <div className='relative'>
//             <Search className='w-5 h-5 absolute left-3 top-2.5 text-monarch-neutral-400' />
//             <input
//               type='text'
//               placeholder='Search transactions...'
//               className='pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-monarch-orange-500 focus:border-monarch-orange-500'
//             />
//           </div>
//           <button className='flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-monarch-neutral-50'>
//             <Calendar className='w-4 h-4' />
//             Date
//           </button>
//           <button className='flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-monarch-neutral-50'>
//             <Filter className='w-4 h-4' />
//             Filters
//           </button>
//           <button
//             onClick={() => setShowTransactionModal(true)}
//             className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
//             <PlusCircle className='w-4 h-4' />
//             Add transaction
//           </button>
//         </div>
//       </div>

//       <div className='bg-white rounded-xl shadow-sm border'>
//         <div className='p-4 border-b'>
//           <div className='flex justify-between items-center'>
//             <p className='text-sm text-monarch-neutral-600'>All transactions</p>
//             <p className='text-sm text-monarch-neutral-600'>April 5, 2025</p>
//           </div>
//         </div>

//         <div className='divide-y'>
//           {transactions.map((transaction) => (
//             <div
//               key={transaction.id}
//               className='p-4 hover:bg-monarch-neutral-50 cursor-pointer'
//               onClick={() => {
//                 setSelectedTransaction(transaction);
//                 setShowTransactionModal(true);
//               }}>
//               <div className='flex justify-between items-center'>
//                 <div className='flex items-center'>
//                   <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center mr-4'>
//                     <span className='text-sm font-medium text-monarch-neutral-600'>
//                       {transaction.merchant.charAt(0)}
//                     </span>
//                   </div>
//                   <div>
//                     <p className='font-medium text-monarch-neutral-800'>
//                       {transaction.merchant}
//                     </p>
//                     <div className='flex items-center gap-4 text-sm text-monarch-neutral-600'>
//                       <span>{transaction.category}</span>
//                       <span>{transaction.account}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='text-right'>
//                   <p
//                     className={`font-semibold ${transaction.amount < 0 ? 'text-monarch-red-600' : 'text-monarch-green-600'}`}>
//                     {transaction.amount < 0 ? '-' : '+'}$
//                     {Math.abs(transaction.amount).toFixed(2)}
//                   </p>
//                   <p className='text-sm text-monarch-neutral-600'>
//                     {new Date(transaction.date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const BudgetPage = () => {
//     const handleCategorySave = (categoryData, parentCategoryId) => {
//       if (parentCategoryId) {
//         setBudgetCategories((prev) =>
//           prev.map((cat) => {
//             if (cat.id === parentCategoryId) {
//               const existingSubIndex = cat.subcategories.findIndex(
//                 (sub) => sub.id === categoryData.id
//               );
//               if (existingSubIndex >= 0) {
//                 const updatedSubs = [...cat.subcategories];
//                 updatedSubs[existingSubIndex] = categoryData;
//                 return { ...cat, subcategories: updatedSubs };
//               } else {
//                 return {
//                   ...cat,
//                   subcategories: [...cat.subcategories, categoryData],
//                 };
//               }
//             }
//             return cat;
//           })
//         );
//       } else {
//         const existingCatIndex = budgetCategories.findIndex(
//           (cat) => cat.id === categoryData.id
//         );
//         if (existingCatIndex >= 0) {
//           setBudgetCategories((prev) => {
//             const updated = [...prev];
//             updated[existingCatIndex] = {
//               ...updated[existingCatIndex],
//               ...categoryData,
//             };
//             return updated;
//           });
//         } else {
//           setBudgetCategories((prev) => [
//             ...prev,
//             { ...categoryData, subcategories: [] },
//           ]);
//         }
//       }
//     };

//     const handleDeleteCategory = (categoryId) => {
//       setBudgetCategories((prev) =>
//         prev.filter((cat) => cat.id !== categoryId)
//       );
//     };

//     const handleDeleteSubcategory = (categoryId, subcategoryId) => {
//       setBudgetCategories((prev) =>
//         prev.map((cat) => {
//           if (cat.id === categoryId) {
//             return {
//               ...cat,
//               subcategories: cat.subcategories.filter(
//                 (sub) => sub.id !== subcategoryId
//               ),
//             };
//           }
//           return cat;
//         })
//       );
//     };

//     const handleArchiveCategory = (categoryId) => {
//       setBudgetCategories((prev) =>
//         prev.map((cat) =>
//           cat.id === categoryId ? { ...cat, archived: !cat.archived } : cat
//         )
//       );
//     };

//     const handleArchiveSubcategory = (categoryId, subcategoryId) => {
//       setBudgetCategories((prev) =>
//         prev.map((cat) => {
//           if (cat.id === categoryId) {
//             return {
//               ...cat,
//               subcategories: cat.subcategories.map((sub) =>
//                 sub.id === subcategoryId
//                   ? { ...sub, archived: !sub.archived }
//                   : sub
//               ),
//             };
//           }
//           return cat;
//         })
//       );
//     };

//     const toggleCategoryExpansion = (categoryId) => {
//       setExpandedCategories((prev) => ({
//         ...prev,
//         [categoryId]: !prev[categoryId],
//       }));
//     };

//     return (
//       <div className='p-6'>
//         <div className='flex justify-between items-center mb-6'>
//           <h1 className='text-2xl font-bold text-monarch-neutral-800'>Budget</h1>
//           <div className='flex items-center gap-4'>
//             <div className='text-right'>
//               <p className='text-2xl font-bold text-monarch-green-600'>$1,268</p>
//               <p className='text-sm text-monarch-neutral-600'>Left to budget</p>
//             </div>
//             <button
//               onClick={() => {
//                 setEditingCategory({});
//                 setShowCategoryModal(true);
//               }}
//               className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
//               <Plus className='w-4 h-4' />
//               Add Category
//             </button>
//           </div>
//         </div>

//         <div className='space-y-4'>
//           {budgetCategories
//             .filter((cat) => !cat.archived)
//             .map((category) => (
//               <div
//                 key={category.id}
//                 className='bg-white rounded-xl shadow-sm border'>
//                 <div className='p-4'>
//                   <div className='flex items-center justify-between'>
//                     <div className='flex items-center gap-3'>
//                       <button className='cursor-move text-monarch-neutral-400 hover:text-monarch-neutral-600'>
//                         <GripVertical className='w-5 h-5' />
//                       </button>

//                       <button
//                         onClick={() => toggleCategoryExpansion(category.id)}
//                         className='text-monarch-neutral-600 hover:text-monarch-neutral-800'>
//                         {expandedCategories[category.id] ? (
//                           <ChevronUp className='w-5 h-5' />
//                         ) : (
//                           <ChevronDown className='w-5 h-5' />
//                         )}
//                       </button>

//                       <div>
//                         <h3 className='font-semibold text-monarch-neutral-800'>
//                           {category.name}
//                         </h3>
//                         <p className='text-sm text-monarch-neutral-600'>
//                           ${category.spent} of ${category.budgeted} spent
//                         </p>
//                       </div>
//                     </div>

//                     <div className='flex items-center gap-4'>
//                       <div className='text-right'>
//                         <p className='font-semibold text-lg'>
//                           ${category.remaining}
//                         </p>
//                         <p className='text-sm text-monarch-neutral-600'>remaining</p>
//                       </div>

//                       <div className='flex items-center gap-2'>
//                         <button
//                           onClick={() => {
//                             setEditingCategory(category);
//                             setShowCategoryModal(true);
//                           }}
//                           className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
//                           <Edit3 className='w-4 h-4' />
//                         </button>

//                         <button
//                           onClick={() => handleArchiveCategory(category.id)}
//                           className='text-monarch-neutral-500 hover:text-yellow-600 p-1'>
//                           <Archive className='w-4 h-4' />
//                         </button>

//                         <button
//                           onClick={() => handleDeleteCategory(category.id)}
//                           className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
//                           <Trash2 className='w-4 h-4' />
//                         </button>

//                         <button
//                           onClick={() => {
//                             setEditingSubcategory({});
//                             setEditingCategory({ id: category.id });
//                             setShowSubcategoryModal(true);
//                           }}
//                           className='text-monarch-orange-500 hover:text-monarch-orange-600 p-1'>
//                           <Plus className='w-4 h-4' />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   <div className='mt-4'>
//                     <div className='w-full bg-monarch-neutral-200 rounded-full h-2'>
//                       <div
//                         className='bg-monarch-orange-500 h-2 rounded-full transition-all duration-300'
//                         style={{
//                           width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%`,
//                         }}></div>
//                     </div>
//                   </div>
//                 </div>

//                 {expandedCategories[category.id] && (
//                   <div className='border-t bg-monarch-neutral-50'>
//                     {category.subcategories
//                       .filter((sub) => !sub.archived)
//                       .map((sub) => (
//                         <div
//                           key={sub.id}
//                           className='px-4 py-3 border-b last:border-b-0'>
//                           <div className='flex items-center justify-between'>
//                             <div className='flex items-center gap-3'>
//                               <button className='cursor-move text-monarch-neutral-400 hover:text-monarch-neutral-600 ml-8'>
//                                 <GripVertical className='w-4 h-4' />
//                               </button>

//                               <div className='w-3 h-3 bg-monarch-green-500 rounded-full'></div>

//                               <div>
//                                 <span className='text-sm font-medium text-monarch-neutral-700'>
//                                   {sub.name}
//                                 </span>
//                                 <p className='text-xs text-monarch-neutral-500'>
//                                   ${sub.spent} of ${sub.budgeted}
//                                 </p>
//                               </div>
//                             </div>

//                             <div className='flex items-center gap-6'>
//                               <div className='flex gap-6 text-sm'>
//                                 <span className='text-monarch-neutral-600'>
//                                   Budget: ${sub.budgeted}
//                                 </span>
//                                 <span className='text-monarch-neutral-600'>
//                                   Spent: ${sub.spent}
//                                 </span>
//                                 <span className='text-monarch-green-600 font-medium'>
//                                   Remaining: ${sub.remaining}
//                                 </span>
//                               </div>

//                               <div className='flex items-center gap-1'>
//                                 <button
//                                   onClick={() => {
//                                     setEditingSubcategory(sub);
//                                     setEditingCategory({ id: category.id });
//                                     setShowSubcategoryModal(true);
//                                   }}
//                                   className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
//                                   <Edit3 className='w-3 h-3' />
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     handleArchiveSubcategory(
//                                       category.id,
//                                       sub.id
//                                     )
//                                   }
//                                   className='text-monarch-neutral-500 hover:text-yellow-600 p-1'>
//                                   <Archive className='w-3 h-3' />
//                                 </button>

//                                 <button
//                                   onClick={() =>
//                                     handleDeleteSubcategory(category.id, sub.id)
//                                   }
//                                   className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
//                                   <Trash2 className='w-3 h-3' />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//         </div>

//         {budgetCategories.some(
//           (cat) => cat.archived || cat.subcategories.some((sub) => sub.archived)
//         ) && (
//           <div className='mt-6 p-4 bg-monarch-neutral-100 rounded-lg'>
//             <h3 className='font-semibold text-monarch-neutral-700 mb-3'>Archived Items</h3>
//             <div className='space-y-2'>
//               {budgetCategories
//                 .filter((cat) => cat.archived)
//                 .map((cat) => (
//                   <div
//                     key={cat.id}
//                     className='flex items-center justify-between py-2 px-3 bg-white rounded border'>
//                     <span className='text-monarch-neutral-600'>{cat.name} (Category)</span>
//                     <div className='flex gap-2'>
//                       <button
//                         onClick={() => handleArchiveCategory(cat.id)}
//                         className='text-sm text-monarch-blue-600 hover:text-monarch-blue-800'>
//                         Restore
//                       </button>
//                       <button
//                         onClick={() => handleDeleteCategory(cat.id)}
//                         className='text-sm text-monarch-red-600 hover:text-monarch-red-800'>
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {showCategoryModal && (
//           <CategoryModal
//             category={editingCategory}
//             onClose={() => {
//               setShowCategoryModal(false);
//               setEditingCategory(null);
//             }}
//             onSave={handleCategorySave}
//           />
//         )}

//         {showSubcategoryModal && (
//           <CategoryModal
//             subcategory={editingSubcategory}
//             onClose={() => {
//               setShowSubcategoryModal(false);
//               setEditingSubcategory(null);
//               setEditingCategory(null);
//             }}
//             onSave={handleCategorySave}
//             parentCategoryId={editingCategory?.id}
//           />
//         )}
//       </div>
//     );
//   };

//   const GoalsPage = () => {
//     const handleGoalSave = (goalData) => {
//       const existingIndex = goals.findIndex((g) => g.id === goalData.id);
//       if (existingIndex >= 0) {
//         setGoals((prev) => {
//           const updated = [...prev];
//           updated[existingIndex] = goalData;
//           return updated;
//         });
//       } else {
//         setGoals((prev) => [...prev, goalData]);
//       }
//     };

//     const handleDeleteGoal = (goalId) => {
//       setGoals((prev) => prev.filter((g) => g.id !== goalId));
//     };

//     return (
//       <div className='p-6'>
//         <div className='flex justify-between items-center mb-6'>
//           <h1 className='text-2xl font-bold text-monarch-neutral-800'>Goals</h1>
//           <button
//             onClick={() => {
//               setEditingGoal({});
//               setShowGoalModal(true);
//             }}
//             className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
//             <Plus className='w-4 h-4' />
//             Add Goal
//           </button>
//         </div>

//         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//           {goals.map((goal) => (
//             <div
//               key={goal.id}
//               className='bg-white rounded-xl p-6 shadow-sm border relative group'>
//               <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
//                 <div className='flex gap-1'>
//                   <button
//                     onClick={() => {
//                       setEditingGoal(goal);
//                       setShowGoalModal(true);
//                     }}
//                     className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
//                     <Edit3 className='w-4 h-4' />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteGoal(goal.id)}
//                     className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
//                     <Trash2 className='w-4 h-4' />
//                   </button>
//                 </div>
//               </div>

//               <div className='flex items-center mb-4'>
//                 <div className='w-12 h-12 bg-monarch-neutral-100 rounded-lg flex items-center justify-center mr-4'>
//                   <Target className='w-6 h-6 text-monarch-neutral-600' />
//                 </div>
//                 <div>
//                   <h3 className='font-semibold text-monarch-neutral-800'>{goal.name}</h3>
//                   <p className='text-sm text-monarch-neutral-600'>
//                     ${goal.current} of ${goal.target}
//                   </p>
//                 </div>
//               </div>

//               {goal.target > 0 && (
//                 <>
//                   <div className='w-full bg-monarch-neutral-200 rounded-full h-2 mb-3'>
//                     <div
//                       className='bg-monarch-green-500 h-2 rounded-full'
//                       style={{ width: `${goal.progress}%` }}></div>
//                   </div>
//                   <p className='text-sm text-monarch-neutral-600'>
//                     {goal.progress.toFixed(0)}% complete
//                   </p>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>

//         {showGoalModal && (
//           <GoalModal
//             goal={editingGoal}
//             onClose={() => {
//               setShowGoalModal(false);
//               setEditingGoal(null);
//             }}
//             onSave={handleGoalSave}
//           />
//         )}
//       </div>
//     );
//   };

//   const RecurringPage = () => {
//     const handleRecurringSave = (recurringData) => {
//       const existingIndex = recurringTransactions.findIndex(
//         (r) => r.id === recurringData.id
//       );
//       if (existingIndex >= 0) {
//         setRecurringTransactions((prev) => {
//           const updated = [...prev];
//           updated[existingIndex] = recurringData;
//           return updated;
//         });
//       } else {
//         setRecurringTransactions((prev) => [...prev, recurringData]);
//       }
//     };

//     const handleDeleteRecurring = (recurringId) => {
//       setRecurringTransactions((prev) =>
//         prev.filter((r) => r.id !== recurringId)
//       );
//     };

//     return (
//       <div className='p-6'>
//         <div className='flex justify-between items-center mb-6'>
//           <h1 className='text-2xl font-bold text-monarch-neutral-800'>Recurring</h1>
//           <div className='flex items-center gap-4'>
//             <p className='text-sm text-monarch-neutral-600'>$153.90 remaining due</p>
//             <button
//               onClick={() => {
//                 setEditingRecurring({});
//                 setShowRecurringModal(true);
//               }}
//               className='bg-monarch-orange-500 text-white px-4 py-2 rounded-lg hover:bg-monarch-orange-600 flex items-center gap-2'>
//               <Plus className='w-4 h-4' />
//               Add Recurring
//             </button>
//           </div>
//         </div>

//         <div className='bg-white rounded-xl shadow-sm border'>
//           <div className='divide-y'>
//             {recurringTransactions.map((transaction) => (
//               <div key={transaction.id} className='p-4 group hover:bg-monarch-neutral-50'>
//                 <div className='flex justify-between items-center'>
//                   <div className='flex items-center'>
//                     <div className='w-10 h-10 bg-monarch-neutral-100 rounded-full flex items-center justify-center mr-4'>
//                       <Repeat className='w-5 h-5 text-monarch-neutral-600' />
//                     </div>
//                     <div>
//                       <p className='font-medium text-monarch-neutral-800'>
//                         {transaction.name}
//                       </p>
//                       <p className='text-sm text-monarch-neutral-600'>
//                         {transaction.frequency}
//                       </p>
//                     </div>
//                   </div>
//                   <div className='flex items-center gap-4'>
//                     <div className='text-right'>
//                       <p className='font-semibold text-monarch-neutral-800'>
//                         ${transaction.amount}
//                       </p>
//                       <p className='text-sm text-monarch-neutral-600'>
//                         {transaction.nextDue}
//                       </p>
//                     </div>
//                     <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
//                       <button
//                         onClick={() => {
//                           setEditingRecurring(transaction);
//                           setShowRecurringModal(true);
//                         }}
//                         className='text-monarch-neutral-500 hover:text-monarch-blue-600 p-1'>
//                         <Edit3 className='w-4 h-4' />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteRecurring(transaction.id)}
//                         className='text-monarch-neutral-500 hover:text-monarch-red-600 p-1'>
//                         <Trash2 className='w-4 h-4' />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {showRecurringModal && (
//           <RecurringModal
//             recurring={editingRecurring}
//             onClose={() => {
//               setShowRecurringModal(false);
//               setEditingRecurring(null);
//             }}
//             onSave={handleRecurringSave}
//           />
//         )}
//       </div>
//     );
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <Dashboard />;
//       case 'transactions':
//         return <TransactionsPage />;
//       case 'budget':
//         return <BudgetPage />;
//       case 'goals':
//         return <GoalsPage />;
//       case 'recurring':
//         return <RecurringPage />;
//       default:
//         return (
//           <div className='p-6'>
//             <h1 className='text-2xl font-bold text-monarch-neutral-800 mb-4'>
//               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//             </h1>
//             <p className='text-monarch-neutral-600'>This section is coming soon!</p>
//           </div>
//         );
//     }
//   };

//   const handleTransactionSave = (transactionData) => {
//     if (selectedTransaction) {
//       setTransactions(
//         transactions.map((t) =>
//           t.id === selectedTransaction.id ? { ...transactionData, id: t.id } : t
//         )
//       );
//     } else {
//       const newTransaction = {
//         id: Date.now(),
//         ...transactionData,
//         account: 'Checking Account (...5828)',
//         type: transactionData.amount < 0 ? 'expense' : 'income',
//       };
//       setTransactions([newTransaction, ...transactions]);
//     }
//     setSelectedTransaction(null);
//   };

//   return (
//     <div className='flex h-screen bg-monarch-neutral-100'>
//       <Sidebar />

//       <div className='flex-1 overflow-auto'>{renderContent()}</div>

//       {showTransactionModal && (
//         <TransactionModal
//           transaction={selectedTransaction}
//           onClose={() => {
//             setShowTransactionModal(false);
//             setSelectedTransaction(null);
//           }}
//           onSave={handleTransactionSave}
//         />
//       )}
//     </div>
//   );
// };

// export default BudgetApp;
