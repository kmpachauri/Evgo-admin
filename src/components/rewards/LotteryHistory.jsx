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

const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`

const LotteryHistory = () => {
  const { fetchData } = useAxios()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState({ totalDistributed: 0, totalClaims: 0 })

  const loadHistory = async () => {
    try {
      setLoading(true)
      const res = await fetchData({ url: '/api/v1/admin/lottery/history' })
      if (res.success) {
        setRows(res.data.rows || [])
        setSummary(res.data.summary || { totalDistributed: 0, totalClaims: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  if (loading) {
    return <div className="text-center p-5"><CSpinner color="primary" /></div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Lottery History</strong>
            <span className="ms-3">Distributed: {formatCurrency(summary.totalDistributed)}</span>
            <span className="ms-3">Claims: {summary.totalClaims}</span>
          </CCardHeader>
          <CCardBody>
            <CTable responsive striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Plan</CTableHeaderCell>
                  <CTableHeaderCell>Range</CTableHeaderCell>
                  <CTableHeaderCell>Reward</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Reference</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rows.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{item.user?.userId}<br /><small>{item.user?.name}</small></CTableDataCell>
                    <CTableDataCell>{item.planName}</CTableDataCell>
                    <CTableDataCell>{formatCurrency(item.minAmount)} - {formatCurrency(item.maxAmount)}</CTableDataCell>
                    <CTableDataCell>{item.status === 'claimed' ? formatCurrency(item.rewardAmount) : '-'}</CTableDataCell>
                    <CTableDataCell className="text-capitalize">{item.status}</CTableDataCell>
                    <CTableDataCell>{item.rewardDate ? new Date(item.rewardDate).toLocaleString('en-IN') : '-'}</CTableDataCell>
                    <CTableDataCell>{item.referenceNumber || '-'}</CTableDataCell>
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

export default LotteryHistory
