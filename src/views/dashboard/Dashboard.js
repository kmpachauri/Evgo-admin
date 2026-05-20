import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilChartLine, cilPeople, cilWallet, cilCash, cilGift, cilWarning } from '@coreui/icons'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useAxios from '../../hooks/useAxios'
import apiRoutes from '../../variables/apiRoutes'
import color from '../color'

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(Number(value || 0))
const formatCurrency = (value) =>
  `₹${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0))}`

function MetricCard({ label, value, route, icon, helper, navigate }) {
  return (
    <CCard
      className="border-0 shadow-sm h-100"
      style={{
        cursor: route ? 'pointer' : 'default',
        background: `linear-gradient(135deg, ${color.dark} 0%, ${color.primary} 60%, ${color.accent} 100%)`,
        borderRadius: 20,
      }}
      onClick={() => route && navigate(route)}
    >
      <CCardBody className="text-white">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-white-50 small">{label}</div>
            <div className="fs-4 fw-bold mt-2">{value}</div>
            {helper ? <div className="small text-white-50 mt-2">{helper}</div> : null}
          </div>
          <div className="rounded-circle p-3" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <CIcon icon={icon} size="xl" />
          </div>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default function Dashboard() {
  const { fetchData, loading } = useAxios()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchData({ url: apiRoutes.dashboardDetails })
        setDashboardData(res?.data || null)
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard data')
      }
    }

    loadDashboard()
  }, [])

  if (loading && !dashboardData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <CSpinner color="primary" size="lg" />
      </div>
    )
  }

  const totals = dashboardData?.totals || {}
  const revenueChart = dashboardData?.revenueChart || []
  const planAnalytics = dashboardData?.planAnalytics || []

  const metricCards = [
    {
      label: 'Total Users',
      value: formatNumber(totals.totalUsers),
      route: '/users-allusers',
      icon: cilPeople,
      helper: `${formatNumber(totals.activeUsers)} active`,
    },
    {
      label: 'Active Users',
      value: formatNumber(totals.activeUsers),
      route: '/active-users',
      icon: cilPeople,
      helper: `${formatNumber(totals.inactiveUsers)} inactive`,
    },
    {
      label: 'Total Recharges',
      value: formatCurrency(totals.totalRecharges),
      route: '/recharges/approved',
      icon: cilCash,
      helper: `${formatNumber(totals.pendingRecharges)} pending`,
    },
    {
      label: 'Total Withdrawals',
      value: formatCurrency(totals.totalWithdrawals),
      route: '/success-withdrawals',
      icon: cilWallet,
      helper: `${formatNumber(totals.pendingWithdrawals)} pending`,
    },
    {
      label: 'Income Distributed',
      value: formatCurrency(totals.totalIncomeDistributed),
      route: '/income/analytics',
      icon: cilChartLine,
      helper: `Today ${formatCurrency(totals.todayIncomeDistribution)}`,
    },
    {
      label: 'Lottery Rewards',
      value: formatCurrency(totals.totalLotteryRewards),
      route: '/lottery/history',
      icon: cilGift,
      helper: `Coupons ${formatCurrency(totals.totalCouponRewards)}`,
    },
  ]

  return (
    <CContainer fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: color.dark }}>
            EVGO Admin Dashboard
          </h2>
          <p className="text-muted mb-0">
            Welcome back, {user?.name || 'Admin'}. Monitor the MLM engine in real time.
          </p>
        </div>
      </div>

      {error ? (
        <CAlert color="danger">
          <CIcon icon={cilWarning} className="me-2" />
          {error}
        </CAlert>
      ) : null}

      <CRow className="g-4 mb-4">
        {metricCards.map((card) => (
          <CCol xl={4} md={6} key={card.label}>
            <MetricCard {...card} navigate={navigate} />
          </CCol>
        ))}
      </CRow>
    </CContainer>
  )
}
