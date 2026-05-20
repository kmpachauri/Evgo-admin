import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'
import apiRoutes from '../../variables/apiRoutes'

const labelMap = {
  plan_daily: 'Daily Plan Income',
  referral_level_1: 'Referral Level 1',
  referral_level_2: 'Referral Level 2',
  referral_level_3: 'Referral Level 3',
  invitation_bonus: 'Invitation Bonus',
  welcome_bonus: 'Welcome Bonus',
  lottery_reward: 'Lottery Reward',
  coupon_reward: 'Coupon Reward',
  sign_in_bonus: 'Sign-in Reward',
}

export default function IncomeAnalytics() {
  const { fetchData, loading } = useAxios()
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData({ url: apiRoutes.incomeAnalytics })
      setData(res?.data || null)
    }
    loadData()
  }, [])

  if (loading && !data) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  const entries = Object.entries(data?.totals || {})

  return (
    <CRow>
      {entries.map(([key, value]) => (
        <CCol md={6} xl={4} key={key}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="text-muted small">{labelMap[key] || key}</div>
              <div className="fs-4 fw-bold">₹{Number(value || 0).toFixed(2)}</div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Recent Income Logs</strong>
          </CCardHeader>
          <CCardBody>
            <CTable responsive striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Source</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {(data?.recentLogs || []).slice(0, 50).map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>
                      {item.user?.userId || 'N/A'}
                      <div className="small text-muted">{item.user?.name || '-'}</div>
                    </CTableDataCell>
                    <CTableDataCell>{labelMap[item.type] || item.type}</CTableDataCell>
                    <CTableDataCell>
                      {item.sourceUser?.userId || item.meta?.sourceUserId || '-'}
                      <div className="small text-muted">{item.sourceUser?.name || item.meta?.couponCode || '-'}</div>
                    </CTableDataCell>
                    <CTableDataCell>₹{Number(item.amount || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{item.title}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(item.creditedAt).toLocaleString('en-IN')}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
