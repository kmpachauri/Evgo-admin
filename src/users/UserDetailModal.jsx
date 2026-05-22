import React, { useEffect, useState } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CButton, CSpinner, CRow, CCol, CCard, CCardBody, CBadge, CTable,
  CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
} from '@coreui/react'
import useAxios from '../hooks/useAxios'
import toast from 'react-hot-toast'
import apiRoutes from '../variables/apiRoutes'

const Stat = ({ label, value, color = 'dark' }) => (
  <CCol xs={6} md={3} className="mb-3">
    <CCard className="text-center h-100">
      <CCardBody className="py-2">
        <div className="text-muted small">{label}</div>
        <div className={`fw-bold fs-5 text-${color}`}>₹{Number(value || 0).toFixed(2)}</div>
      </CCardBody>
    </CCard>
  </CCol>
)

const UserDetailModal = ({ userId, visible, onClose }) => {
  const [detail, setDetail] = useState(null)
  const { fetchData, loading } = useAxios()

  useEffect(() => {
    if (!visible || !userId) return
    setDetail(null)
    fetchData({ url: apiRoutes.userDetail(userId), method: 'GET' })
      .then((res) => {
        if (res?.success) setDetail(res.data)
        else toast.error('Failed to load user details')
      })
      .catch(() => toast.error('Error loading user details'))
  }, [visible, userId])

  const user = detail?.user
  const plans = detail?.plans || []
  const totalPlanAmount = plans.reduce((s, p) => s + Number(p.purchaseAmount || 0), 0)

  return (
    <CModal size="xl" visible={visible} onClose={onClose} scrollable>
      <CModalHeader>
        <CModalTitle>
          User Detail — {userId}
          {user && (
            <CBadge color={user.status === 'active' ? 'success' : user.status === 'pending' ? 'warning' : 'danger'} className="ms-2">
              {user.status}
            </CBadge>
          )}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {loading || !detail ? (
          <div className="text-center py-5"><CSpinner color="primary" /></div>
        ) : (
          <>
            {/* Basic Info */}
            <CRow className="mb-2">
              <CCol md={3}><strong>Name:</strong> {user.name || 'N/A'}</CCol>
              <CCol md={3}><strong>Phone:</strong> {user.phone || 'N/A'}</CCol>
              <CCol md={3}><strong>Sponsor:</strong> {user.sponsorUserId || 'N/A'}</CCol>
            </CRow>

            {/* Stats */}
            <CRow className="mt-3">
              <Stat label="Wallet Balance" value={user.walletBalance} color="success" />
              <Stat label="Total Income" value={user.totalIncome} color="primary" />
          
              <Stat label="Total Plan Invested" value={totalPlanAmount} color="warning" />
              <Stat label="Total Recharge" value={user.totalRecharge} color="secondary" />
              <Stat label="Total Withdraw" value={user.totalWithdraw} color="danger" />
              <Stat label="Team Income" value={user.teamIncome} color="dark" />
              <Stat label="Total Assets" value={user.totalAssets} color="dark" />
            </CRow>

            {/* Plan Purchases */}
            <h6 className="mt-3 mb-2">Plan Purchases ({plans.length})</h6>
            {plans.length === 0 ? (
              <p className="text-muted">No plans purchased.</p>
            ) : (
              <CTable striped bordered hover responsive small>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Plan</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Daily Income</CTableHeaderCell>
                    <CTableHeaderCell>Duration</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Activated</CTableHeaderCell>
                    <CTableHeaderCell>Expires</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {plans.map((p, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>{p.planName}</CTableDataCell>
                      <CTableDataCell>₹{Number(p.purchaseAmount || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>₹{Number(p.dailyIncomeAmount || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{p.durationDays}d</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={p.status === 'active' ? 'success' : p.status === 'completed' ? 'secondary' : 'warning'}>
                          {p.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>{p.activatedAt ? new Date(p.activatedAt).toLocaleDateString() : 'N/A'}</CTableDataCell>
                      <CTableDataCell>{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : 'N/A'}</CTableDataCell>
                    </CTableRow>
                  ))}
                  <CTableRow className="table-warning fw-bold">
                    <CTableDataCell colSpan={2}>Total</CTableDataCell>
                    <CTableDataCell>₹{totalPlanAmount.toFixed(2)}</CTableDataCell>
                    <CTableDataCell colSpan={5}></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            )}
          </>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Close</CButton>
      </CModalFooter>
    </CModal>
  )
}

export default UserDetailModal
