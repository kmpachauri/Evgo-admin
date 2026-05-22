import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilCash,
  cilMoney,
  cilChart,
  cilUser,
  cilWallet,
  cilSettings,
  cilShieldAlt,
  cilDollar,
  cilGraph,
  cilGift,
  cilStar
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'User Management',
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    visible: true,
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Users',
        to: '/users-allusers',
      },
      {
        component: CNavItem,
        name: 'Active Users',
        to: '/active-users',
      },
      {
        component: CNavItem,
        name: 'Pending Users',
        to: '/pending/users',
      },
      {
        component: CNavItem,
        name: 'Suspended Users',
        to: '/suspended/users',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'MLM System',
  },
  {
    component: CNavItem,
    name: 'Add Purchase',
    to: '/manual-purchase/add',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Purchase History',
    to: '/manual-purchase/history',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Plan Management',
    to: '/plans/manage',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Lottery History',
    to: '/lottery/history',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Coupon Management',
    to: '/coupons/manage',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tree View',
    to: '/tree',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Income Reports',
  },
  {
    component: CNavGroup,
    name: 'Income',
    to: '/income',
    visible: true,
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Direct Income',
        to: '/earnings-report',
      },
      {
        component: CNavItem,
        name: 'Bonus History',
        to: '/bounus-history',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Deposits',
  },
  {
    component: CNavGroup,
    name: 'Deposits',
    to: '/deposits',
    visible: true,
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Deposits',
        to: '/deposits',
      },
      {
        component: CNavItem,
        name: 'Pending',
        to: '/recharges/pending',
      },
      {
        component: CNavItem,
        name: 'Approved',
        to: '/recharges/approved',
      },
      {
        component: CNavItem,
        name: 'Rejected',
        to: '/recharges/rejected',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Withdrawals',
  },
  {
    component: CNavGroup,
    name: 'Withdrawals',
    to: '/withdrawals',
    visible: true,
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Withdrawals',
        to: '/withdrawals',
      },
      {
        component: CNavItem,
        name: 'Pending',
        to: '/pending-withDrawals',
      },
      {
        component: CNavItem,
        name: 'Approved',
        to: '/success-withdrawals',
      },
      {
        component: CNavItem,
        name: 'Rejected',
        to: '/rejected-withdrawals',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'KYC Management',
  },
  {
    component: CNavGroup,
    name: 'KYC',
    to: '/kyc',
    visible: true,
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User KYC',
        to: '/user/kyc',
      },
      {
        component: CNavItem,
        name: 'Bank KYC',
        to: '/bank/kyc',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavGroup,
    name: 'Settings',
    to: '/settings',
    visible: true,
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Payment Settings',
        to: '/payment-create',
      },
      {
        component: CNavItem,
        name: 'Social Links',
        to: '/settings/social',
      },
      {
        component: CNavItem,
        name: 'System Settings',
        to: '/settings/system',
      },
    ],
  },
]

export default _nav
