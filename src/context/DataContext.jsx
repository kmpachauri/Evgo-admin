import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  cilCreditCard,
  cilGift,
  cilGraph,
  cilPeople,
  cilSettings,
  cilSpeedometer,
  cilStar,
  cilWallet,
  cilDollar,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem } from '@coreui/react'
import useAuth from '../hooks/useAuth'

export const DataContext = createContext()

const adminTabs = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'All Users', to: '/users-allusers' },
      { component: CNavItem, name: 'Active Users', to: '/active-users' },
      { component: CNavItem, name: 'Pending Users', to: '/pending/users' },
      { component: CNavItem, name: 'Suspended Users', to: '/suspended/users' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Deposits',
    to: '/deposits',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'All Deposits', to: '/deposits' },
      { component: CNavItem, name: 'Pending', to: '/recharges/pending' },
      { component: CNavItem, name: 'Approved', to: '/recharges/approved' },
      { component: CNavItem, name: 'Rejected', to: '/recharges/rejected' },
    ],
  },
  {
    component: CNavGroup,
    name: 'Withdrawals',
    to: '/withdrawals',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Pending', to: '/pending-withDrawals' },
      { component: CNavItem, name: 'Approved', to: '/success-withdrawals' },
      { component: CNavItem, name: 'Rejected', to: '/rejected-withdrawals' },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Plan Management',
  //   to: '/plans/manage',
  //   icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
  // },
  {
    component: CNavGroup,
    name: 'Plans & Rewards',
    to: '/plans-rewards',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      // { component: CNavItem, name: 'Plan Management', to: '/plans/manage' },
      { component: CNavItem, name: 'Lottery History', to: '/lottery/history' },
      { component: CNavItem, name: 'Coupon Management', to: '/coupons/manage' },
    ],
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/earnings-report',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Payment Settings', to: '/payment-create' },
      { component: CNavItem, name: 'Social Links', to: '/settings/social' },
      // { component: CNavItem, name: 'System Settings', to: '/settings/system' },
    ],
  },
]

const userTabs = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/user/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/user/profile',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
  },
]

export const DataProvider = ({ children }) => {
  const { userRole } = useAuth()
  const [siteTabs, setSiteTabs] = useState(adminTabs)

  useEffect(() => {
    setSiteTabs(userRole === 'user' ? userTabs : adminTabs)
  }, [userRole])

  const value = {
    siteTabs,
    setSiteTabs,
    getAllLists: () => {},
    deleteSiteTab: () => {},
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
