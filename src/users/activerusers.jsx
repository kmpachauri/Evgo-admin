import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CSpinner,
  CButton,
  CBadge
} from '@coreui/react'
import useAxios from '../hooks/useAxios'
import toast from 'react-hot-toast'
import apiRoutes from '../variables/apiRoutes'
import Export from '../views/Export'
import color from '../views/color'
import UserDetailModal from './UserDetailModal'

const ActiveUsers = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [userdata, setUserdata] = useState([])
  const [filtered, setFiltered] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { fetchData, loading } = useAxios()
  const itemsPerPage = 10
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  })

  const getActiveUsers = async () => {
    try {
      const data = await fetchData({
        url: apiRoutes.activeUsers,
        method: 'GET',
      })
      if (data.success || data.message === 'Active users fetched successfully') {
        const users = data?.users || []
        setUserdata(users)
        setFiltered(users)
      } else {
        toast.error('Failed to fetch active users')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error fetching active users')
    }
  }

  useEffect(() => {
    getActiveUsers()
  }, [])

  const handleSearch = () => {
    let filteredList = [...userdata]

    if (filters.search) {
      filteredList = filteredList.filter(
        (user) =>
          user.userId?.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
          user.name?.toLowerCase().includes(filters.search.toLowerCase().trim())
      )
    }

    if (filters.from) {
      filteredList = filteredList.filter(
        (user) => new Date(user.createdAt) >= new Date(filters.from)
      )
    }

    if (filters.to) {
      filteredList = filteredList.filter(
        (user) => new Date(user.createdAt) <= new Date(filters.to)
      )
    }

    setFiltered(filteredList)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters({ search: '', from: '', to: '' })
    setFiltered(userdata)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderPagination = () => {
    const pages = []
    const visiblePages = 5

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }

    return pages.map((page, index) => (
      <CPaginationItem
        key={index}
        active={page === currentPage}
        disabled={page === '...'}
        onClick={() => typeof page === 'number' && setCurrentPage(page)}
        style={{ cursor: page === '...' ? 'default' : 'pointer' }}
      >
        {page}
      </CPaginationItem>
    ))
  }

  const fields = [
    { key: "userId", label: "User Id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "walletBalance", label: "Wallet Balance" },
    { key: "totalPlanAmount", label: "Total Plan Amount" },
    { key: "totalIncome", label: "Total Income" },
    { key: "todayIncome", label: "Today Income" },
  ]

  return (
    <>
    <UserDetailModal
      userId={selectedUserId}
      visible={showModal}
      onClose={() => { setShowModal(false); setSelectedUserId(null) }}
    />
    <CCard className="mb-4">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Active Users</h4>
          <CBadge color="success" className="p-2">
            Total: {filtered.length}
          </CBadge>
        </div>

        <CRow className="mb-3">
          <CCol md={3}>
            <CFormInput
              label="UserId / Name"
              placeholder="Search by UserId or Name"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="date"
              label="From Date"
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value })
              }
            />
          </CCol>

          <CCol md={3}>
            <CFormInput
              type="date"
              label="To Date"
              value={filters.to}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value })
              }
            />
          </CCol>

          <CCol md={3} className="d-flex align-items-end gap-2">
            <CButton
              color="primary"
              onClick={handleSearch}
              style={{
                background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                color: 'white',
              }}
            >
              Search
            </CButton>

            <CButton color="secondary" onClick={handleReset}>
              Reset
            </CButton>
            <Export userdata={filtered} fields={fields} />
          </CCol>
        </CRow>

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CTable striped bordered hover responsive>
              <CTableHead color="success">
                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>UserId</CTableHeaderCell>
                  <CTableHeaderCell>User Name</CTableHeaderCell>
                  <CTableHeaderCell>Mobile No</CTableHeaderCell>
                  <CTableHeaderCell>Wallet Balance</CTableHeaderCell>
                  <CTableHeaderCell>Plan Amount</CTableHeaderCell>
                  <CTableHeaderCell>Total Income</CTableHeaderCell>
                  <CTableHeaderCell>Today Income</CTableHeaderCell>
                  <CTableHeaderCell>Sponsor</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedUsers.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No active users found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </CTableDataCell>
                      <CTableDataCell>{user.userId || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{user.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{user.phone || 'N/A'}</CTableDataCell>
                      <CTableDataCell><strong>₹{Number(user.walletBalance || 0).toFixed(2)}</strong></CTableDataCell>
                      <CTableDataCell>₹{Number(user.totalPlanAmount || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>₹{Number(user.totalIncome || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>₹{Number(user.todayIncome || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{user.sponsor || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        {user.createdAt ? (
                          <>
                            {new Date(user.createdAt).toLocaleDateString()} <br />
                            <small className="text-muted">
                              {new Date(user.createdAt).toLocaleTimeString()}
                            </small>
                          </>
                        ) : (
                          "N/A"
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          size="sm"
                          onClick={() => { setSelectedUserId(user.userId); setShowModal(true) }}
                          style={{
                            background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                            color: 'white',
                          }}
                        >
                          Detail
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            <CPagination align="center" className="mt-3 flex-wrap">
              {renderPagination()}
            </CPagination>
          </>
        )}
      </CCardBody>
    </CCard>
    </>
  )
}

export default ActiveUsers
