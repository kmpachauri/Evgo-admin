import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CNav, CNavItem, CNavLink, CTabContent, CTabPane,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CFormInput, CRow, CCol, CSpinner, CBadge,
} from '@coreui/react'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import useAxios from '../hooks/useAxios'
import color from '../views/color'

const TABS = ['all', 'pending', 'approved', 'rejected']

export default function Deposits() {
  const { fetchData, loading } = useAxios()
  const [activeTab, setActiveTab] = useState('all')
  const [allData, setAllData] = useState({ all: [], pending: [], approved: [], rejected: [] })
  const [filtered, setFiltered] = useState([])
  const [filters, setFilters] = useState({ search: '', from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchAll = async () => {
    try {
      const res = await fetchData({ url: '/admin/recharges', method: 'GET' })
      const rows = res?.data || []
      setAllData({
        all: rows,
        pending: rows.filter((r) => r.status === 'pending'),
        approved: rows.filter((r) => r.status === 'approved'),
        rejected: rows.filter((r) => r.status === 'rejected'),
      })
    } catch {
      toast.error('Failed to fetch deposits')
    }
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    const list = allData[activeTab] || []
    let nextList = [...list]

    if (filters.search) {
      const needle = filters.search.toLowerCase()
      nextList = nextList.filter(
        (r) =>
          r.user?.userId?.toLowerCase().includes(needle) ||
          r.user?.name?.toLowerCase().includes(needle) ||
          r.utrNumber?.toLowerCase().includes(needle),
      )
    }

    if (filters.from) {
      nextList = nextList.filter((r) => new Date(r.createdAt) >= new Date(filters.from))
    }

    if (filters.to) {
      nextList = nextList.filter((r) => new Date(r.createdAt) <= new Date(filters.to))
    }

    setFiltered(nextList)
    setCurrentPage(1)
  }, [activeTab, allData, filters])

  const handleApprove = (id) => {
    Swal.fire({
      title: 'Approve this deposit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve',
      confirmButtonColor: '#28a745',
    }).then(async (result) => {
      if (!result.isConfirmed) return
      try {
        await fetchData({ url: `/admin/recharges/${id}/approve`, method: 'PUT' })
        toast.success('Deposit approved')
        fetchAll()
      } catch (err) {
        toast.error(err?.message || 'Failed to approve')
      }
    })
  }

  const handleReject = async (id) => {
    const { value: remark } = await Swal.fire({
      title: 'Reject Reason',
      input: 'text',
      inputPlaceholder: 'Enter reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc3545',
      inputValidator: (v) => !v && 'Reason is required',
    })
    if (!remark) return
    try {
      await fetchData({ url: `/admin/recharges/${id}/reject`, method: 'PUT', data: { remark } })
      toast.success('Deposit rejected')
      fetchAll()
    } catch (err) {
      toast.error(err?.message || 'Failed to reject')
    }
  }

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const badgeColor = { all: 'secondary', pending: 'warning', approved: 'success', rejected: 'danger' }

  return (
    <CCard>
      <CCardBody>
        {/* Tabs */}
        <CNav variant="tabs" className="mb-3">
          {TABS.map((tab) => (
            <CNavItem key={tab}>
              <CNavLink active={activeTab === tab} onClick={() => setActiveTab(tab)} style={{ cursor: 'pointer', textTransform: 'capitalize' }}>
                {tab} <CBadge color={badgeColor[tab]} className="ms-1">{allData[tab]?.length || 0}</CBadge>
              </CNavLink>
            </CNavItem>
          ))}
        </CNav>

        {/* Search */}
        <CRow className="mb-3">
          <CCol md={3}>
            <CFormInput
              label="User ID / Name / UTR"
              placeholder="Search history"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
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
            <CButton
              color="secondary"
              onClick={() => setFilters({ search: '', from: '', to: '' })}
            >
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
                <CTableHeaderCell>UTR Number</CTableHeaderCell>
                <CTableHeaderCell>Method</CTableHeaderCell>
                <CTableHeaderCell>Plan</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                {activeTab === 'pending' && <CTableHeaderCell>Action</CTableHeaderCell>}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginated.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={activeTab === 'pending' ? 10 : 9} className="text-center text-muted py-4">
                    No {activeTab} deposits found
                  </CTableDataCell>
                </CTableRow>
              ) : paginated.map((row, i) => (
                <CTableRow key={row._id}>
                  <CTableDataCell>{(currentPage - 1) * itemsPerPage + i + 1}</CTableDataCell>
                  <CTableDataCell>{row.user?.userId || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{row.user?.name || 'N/A'}</CTableDataCell>
                  <CTableDataCell><strong>₹{Number(row.amount || 0).toFixed(2)}</strong></CTableDataCell>
                  <CTableDataCell><code>{row.utrNumber || 'N/A'}</code></CTableDataCell>
                  <CTableDataCell>{row.paymentMethod || 'UPI'}</CTableDataCell>
                  <CTableDataCell>{row.plan?.name || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={badgeColor[row.status]}>{row.status}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}<br />
                    <small className="text-muted">{row.createdAt ? new Date(row.createdAt).toLocaleTimeString() : ''}</small>
                  </CTableDataCell>
                  {activeTab === 'pending' && (
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="success"
                        className="me-1"
                        onClick={() => handleApprove(row._id)}
                      >
                        Approve
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        onClick={() => handleReject(row._id)}
                      >
                        Reject
                      </CButton>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-1 mt-3 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <CButton key={i} size="sm" color={i + 1 === currentPage ? 'dark' : 'light'} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </CButton>
            ))}
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}
