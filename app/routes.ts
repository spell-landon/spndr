import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

export default [
  route('login', './routes/login.tsx'), // Only one login route
  layout('./routes/layout.tsx', [
    index('./routes/dashboard.tsx'), // "/" goes to Dashboard if logged in
    route('transactions', './routes/transactions.tsx'),
    route('budget', './routes/budget.tsx'),
    route('goals', './routes/goals.tsx'),
    route('recurring', './routes/recurring.tsx'),
    route('profile', './routes/profile.tsx'),
  ]),
] satisfies RouteConfig;
