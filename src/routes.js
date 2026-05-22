import React from 'react'

// User Management
import allusers from './users/allusers'
import activerusers from './users/activerusers'
import SuspendedUsers from './views/pages/member/SuspendedUsers'
import PendingUsersWithFilter from './components/common/Table/DynamicTable'
import Updateuser from './admin/Updateuser'

// Income Reports
import directIncomeReport from './incomeReport/directIncomeReport'
import BounusHistory from './incomeReport/BounusHistory'
import PairHistory from './incomeReport/PairHistory'
import levelUsers from './incomeReport/levelusers'
import TeamAnalytics from './components/analytics/TeamAnalytics'
import IncomeAnalytics from './components/analytics/IncomeAnalytics'
import DailyIncomeLogs from './components/logs/DailyIncomeLogs'
import SystemSettings from './components/settings/SystemSettings'
import PaymentSettings from './components/settings/PaymentSettings'
import SocialLinks from './views/SocialLinks'
import Deposits from './Topup/Deposits'
import PlanManagement from './components/plans/PlanManagement'

// Withdrawals
import PendingWithdrawals from './Withdrawals/PendingWithdrawals'
import SuccessWithdrawals from './Withdrawals/SuccessWithdrawals'
import WithdrawalsRejected from './Withdrawals/WithdrawalsRejected'
import TopupPending from './Topup/TopupPending'
import TopupApproved from './Topup/TopupApproved'
import TopupRejected from './Topup/TopupRejected'

// KYC
import UserKyc from './views/base/customPage/UserKyc'
import BankKYC from './views/base/customPage/BankKyc'

// Payment Settings

// Tree View
const TreeView = React.lazy(() => import('./components/treeView/index'))

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// User Dashboard & Profile
const UserDashboard = React.lazy(() => import('./components/user/Dashboard'))
const UserProfile = React.lazy(() => import('./components/user/Profile'))
const ChangePassword = React.lazy(() => import('./components/user/ChangePassword'))

// Manual Purchase Components
const ManualPurchaseAdd = React.lazy(() => import('./components/manualPurchase/AddPurchase'))
const ManualPurchaseHistory = React.lazy(
  () => import('./components/manualPurchase/PurchaseHistory'),
)
const LotteryHistory = React.lazy(() => import('./components/rewards/LotteryHistory'))
const CouponManagement = React.lazy(() => import('./components/rewards/CouponManagement'))

const routes = [
  { path: '/', name: '', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // User Management
  { path: '/users-allusers', name: 'All Users', element: allusers },
  { path: '/active-users', exact: true, name: 'Active Users', element: activerusers },
  { path: '/pending/users', name: 'Pending Users', element: PendingUsersWithFilter },
  { path: '/suspended/users', name: 'Suspended Users', element: SuspendedUsers },
  { path: '/user/update/:userId', name: 'Update User', element: Updateuser },

  // MLM Operations
  { path: '/manual-purchase/add', name: 'Add Purchase', element: ManualPurchaseAdd },
  { path: '/manual-purchase/history', name: 'Purchase History', element: ManualPurchaseHistory },
  { path: '/plans/manage', name: 'Plan Management', element: PlanManagement },
  { path: '/recharges/pending', name: 'Pending Recharges', element: TopupPending },
  { path: '/recharges/approved', name: 'Approved Recharges', element: TopupApproved },
  { path: '/recharges/rejected', name: 'Rejected Recharges', element: TopupRejected },
  { path: '/topup-pending', name: 'Pending Recharges', element: TopupPending },
  { path: '/topup-approved', name: 'Approved Recharges', element: TopupApproved },
  { path: '/topup-rejected', name: 'Rejected Recharges', element: TopupRejected },
  { path: '/lottery/history', name: 'Lottery History', element: LotteryHistory },
  { path: '/coupons/manage', name: 'Coupon Management', element: CouponManagement },
  { path: '/payment-create', name: 'Payment Settings', element: PaymentSettings },
  { path: '/settings/system', name: 'System Settings', element: SystemSettings },
  { path: '/settings/social', name: 'Social Links', element: SocialLinks },
  { path: '/deposits', name: 'Deposits', element: Deposits },
  { path: '/logs/daily-income', name: 'Daily Income Logs', element: DailyIncomeLogs },
  { path: '/team/analytics', name: 'Team Analytics', element: TeamAnalytics },
  { path: '/income/analytics', name: 'Income Analytics', element: IncomeAnalytics },

  // Income Reports
  { path: '/earnings-report', name: 'Direct Income Report', element: directIncomeReport },
  { path: '/pair-history', name: 'Binary Matching History', element: PairHistory },
  { path: '/bounus-history', name: 'Bonus History', element: BounusHistory },
  { path: '/level-users/:level', name: 'Level Users', element: levelUsers },

  // Withdrawals
  { path: '/pending-withDrawals', name: 'Pending Withdrawals', element: PendingWithdrawals },
  { path: '/success-withdrawals', name: 'Approved Withdrawals', element: SuccessWithdrawals },
  { path: '/rejected-withdrawals', name: 'Rejected Withdrawals', element: WithdrawalsRejected },

  // KYC Management
  { path: '/user/kyc', name: 'User KYC', element: UserKyc },
  { path: '/bank/kyc', name: 'Bank KYC', element: BankKYC },

  // Tree View
  { path: '/tree', name: 'Tree View', element: TreeView },

  // Legacy embedded user pages kept for compatibility
  { path: '/user/dashBoard', name: 'User Dashboard', element: UserDashboard },
  { path: '/user/profile', name: 'User Profile', element: UserProfile },
  { path: '/user/change-password', name: 'Change Password', element: ChangePassword },
]

export default routes
