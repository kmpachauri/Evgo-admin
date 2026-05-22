import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import toast from 'react-hot-toast'
import useAxios from '../hooks/useAxios'
import Swal from 'sweetalert2'

const TABS = ['all', 'pending', 'approved', 'rejected']
const STATUS_BADGE = {
  all: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export default function AllWithdrawals() {
  const { fetchData, loading } = useAxios()
  const [activeTab, setActiveTab] = useState('all')
  const [allData, setAllData] = useState({ all: [], pending: [], approved: [], rejected: [] })
  const [filtered, setFiltered] = useState([])
  const [filters, setFilters] = useState({
    userId: '',
    from: '',
    to: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchWithdrawals = async () => {
    try {
      const res = await fetchData({ url: '/admin/withdrawals' })
      const rows = res?.data || []
      setAllData({
        all: rows,
        pending: rows.filter((r) => r.status === 'pending'),
        approved: rows.filter((r) => r.status === 'approved'),
        rejected: rows.filter((r) => r.status === 'rejected'),
      })
    } catch (err) {
      toast.error('Failed to fetch withdrawals')
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve this withdrawal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      confirmButtonColor: '#28a745',
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetchData({ url: `/admin/withdrawals/${id}/approve`, method: 'PUT' })
      toast.success(res?.message || 'Withdrawal approved')
      fetchWithdrawals()
    } catch (err) {
      toast.error(err?.message || 'Failed to approve withdrawal')
    }
  }

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Reason',
      input: 'text',
      inputPlaceholder: 'Enter reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc3545',
      inputValidator: (value) => (!value ? 'Reason is required' : undefined),
    })

    if (!result.isConfirmed || !result.value) return

    try {
      const res = await fetchData({
        url: `/admin/withdrawals/${id}/reject`,
        method: 'PUT',
        data: { remark: result.value },
      })
      toast.success(res?.message || 'Withdrawal rejected')
      fetchWithdrawals()
    } catch (err) {
      toast.error(err?.message || 'Failed to reject withdrawal')
    }
  }

  useEffect(() => {
    const list = allData[activeTab] || []
    let nextList = [...list]

    if (filters.userId) {
      const needle = filters.userId.toLowerCase()
      nextList = nextList.filter(
        (item) =>
          item.userId?.toLowerCase().includes(needle) ||
          item.name?.toLowerCase().includes(needle),
      )
    }

    if (filters.from) {
      nextList = nextList.filter((item) => new Date(item.createdAt) >= new Date(filters.from))
    }

    if (filters.to) {
      nextList = nextList.filter((item) => new Date(item.createdAt) <= new Date(filters.to))
    }

    setFiltered(nextList)
    setCurrentPage(1)
  }, [activeTab, allData, filters])

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return (
    <CCard>
      <CCardBody>
        <CNav variant="tabs" className="mb-3">
          {TABS.map((tab) => (
            <CNavItem key={tab}>
              <CNavLink
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                style={{ cursor: 'pointer', textTransform: 'capitalize' }}
              >
                {tab} <CBadge color={STATUS_BADGE[tab]} className="ms-1">{allData[tab]?.length || 0}</CBadge>
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>

        <CRow className="mb-3">
          <CCol md={3}>
            <CFormInput
              label="User ID / Name"
              placeholder="Search history"
              value={filters.userId}
              onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="date"
              label="From Date"
              value={filters.from}
              onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              type="date"
              label="To Date"
              value={filters.to}
              onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
            />
          </CCol>
          <CCol md={3} className="d-flex align-items-end">
            <CButton color="secondary" onClick={() => setFilters({ userId: '', from: '', to: '' })}>
              Reset
            </CButton>
          </CCol>
        </CRow>

        {loading ? (
          <div className="text-center py-4"><CSpinner color="primary" /></div>
        ) : (
          <CTable striped bordered hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>User ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Tax (5%)</CTableHeaderCell>
                <CTableHeaderCell>Net Payable</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Account Number</CTableHeaderCell>
                <CTableHeaderCell>IFSC Code</CTableHeaderCell>
                <CTableHeaderCell>Bank Name</CTableHeaderCell>
                {activeTab === 'pending' && <CTableHeaderCell>Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginated.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={activeTab === 'pending' ? 12 : 11} className="text-center text-muted py-4">
                    No {activeTab} withdrawals found
                  </CTableDataCell>
                </CTableRow>
              ) : paginated.map((item, index) => (
                <CTableRow key={item._id}>
                  <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                  <CTableDataCell>{item.userId || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{Number(item.amount || 0).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>₹{Number(item.taxAmount || 0).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>₹{Number(item.netAmount || 0).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={STATUS_BADGE[item.status] || 'secondary'}>
                      {item.status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}<br />
                    <small className="text-muted">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : ''}</small>
                  </CTableDataCell>
                  <CTableDataCell>{item.accountNumber || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.ifscCode || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{item.bankName || 'N/A'}</CTableDataCell>
                  {activeTab === 'pending' && (
                    <CTableDataCell>
                      <CButton size="sm" color="success" className="me-1" onClick={() => handleApprove(item._id)}>
                        Approve
                      </CButton>
                      <CButton size="sm" color="danger" onClick={() => handleReject(item._id)}>
                        Reject
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-1 mt-3 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <CButton
                key={i}
                size="sm"
                color={i + 1 === currentPage ? 'dark' : 'light'}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </CButton>
            ))}
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}
