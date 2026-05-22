import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'
import useAxios from '../../../hooks/useAxios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../../components/common/LoadinSpinner'
import apiRoutes from '../../../variables/apiRoutes'
import color from '../../../views/color'
import Export from '../../../views/Export'
import UserDetailModal from '../../../users/UserDetailModal'

const PendingUsersWithFilter = () => {
  const { fetchData, loading } = useAxios()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchPendingUsers = async () => {
    try {
      const res = await fetchData({ url: apiRoutes.pendingUser, method: 'get' })
      if (res?.message) {
        // console.log('manoj',res.pendingUsers)
        setUsers(res.pendingUsers)
        setFiltered(res.pendingUsers)
      } else {
        toast.error('No users found')
      }
    } catch (err) {
      toast.error('Failed to fetch users')
    }
  }

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const handleSuspendUser = async (userId) => {
    try {
      const res = await fetchData({
        url: apiRoutes.updateUserStatus(userId),
        method: 'PATCH',
        data: { status: 'suspended' },
      })

      if (res?.success) {
        toast.success('User suspended successfully')
        fetchPendingUsers()
      }
    } catch (error) {
      toast.error('Failed to suspend user')
    }
  }

  const handleSearch = () => {
    let filteredList = [...users]

    // if (filters.userId) {
    //   filteredList = filteredList.filter((user) =>
    //     user.userId.toLowerCase().includes(filters.userId.toLowerCase().trim())
    //   );
    // }

    // if (filters.name) {
    //   filteredList = filteredList.filter((user) =>
    //     user.name?.toLowerCase().includes(filters.name.toLowerCase().trim())
    //   );
    // }

    if (filters.search) {
      filteredList = filteredList.filter(
        (user) =>
          user.userId?.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
          user.name?.toLowerCase().includes(filters.search.toLowerCase().trim()),
      )
    }

    if (filters.name) {
      filteredList = filteredList.filter((user) =>
        user.name.toLowerCase().includes(filters.userId.toLowerCase().trim()),
      )
    }

    if (filters.from) {
      filteredList = filteredList.filter(
        (user) => new Date(user.createdAt) >= new Date(filters.from),
      )
    }

    if (filters.to) {
      filteredList = filteredList.filter((user) => new Date(user.createdAt) <= new Date(filters.to))
    }

    // filteredList = filteredList.filter((user) =>
    //   user.userId.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
    //   user.name.toLowerCase().includes(filters.search.toLowerCase().trim())
    // );

    setFiltered(filteredList)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters({ search: '', from: '', to: '' })
    setFiltered(users)
    setCurrentPage(1)
  }

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const renderPagination = () => {
    const pages = []
    const maxPageToShow = 5

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <CButton
            key={i}
            size="sm"
            color={i === currentPage ? 'dark' : 'light'}
            className="me-1"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </CButton>,
        )
      }
    } else {
      pages.push(
        <CButton
          key={1}
          size="sm"
          color={currentPage === 1 ? 'dark' : 'light'}
          className="me-1"
          onClick={() => setCurrentPage(1)}
        >
          1
        </CButton>,
      )

      if (currentPage > 3) {
        pages.push(
          <span key="dots1" className="mx-1">
            ...
          </span>,
        )
      }

      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <CButton
            key={i}
            size="sm"
            color={i === currentPage ? 'dark' : 'light'}
            className="me-1"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </CButton>,
        )
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots2" className="mx-1">
            ...
          </span>,
        )
      }

      pages.push(
        <CButton
          key={totalPages}
          size="sm"
          color={currentPage === totalPages ? 'dark' : 'light'}
          className="me-1"
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </CButton>,
      )
    }

    return pages
  }

  const fields = [
    { key: 'userId', label: 'User Id' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'phone' },
    { key: 'inviteCode', label: 'Referral Code' },
    { key: 'walletBalance', label: 'Wallet Balance' },
    { key: 'totalPlanAmount', label: 'Total Plan Amount' },
    { key: 'totalIncome', label: 'Total Income' },
    { key: 'todayIncome', label: 'Today Income' },
    { key: 'sponsor', label: 'Sponsor' },
  ]

  return (
    <>
      <UserDetailModal
        userId={selectedUserId}
        visible={showModal}
        onClose={() => { setShowModal(false); setSelectedUserId(null) }}
      />
      {loading && <LoadingSpinner />}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="UserId"
            placeholder="Search by UserId , Name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="From Date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="To Date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
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

          <Export userdata={users} fields={fields} />
        </CCol>
      </CRow>

      <div className="table-responsive">
        <CTable hover bordered responsive className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>UserId</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile</CTableHeaderCell>
              <CTableHeaderCell>Wallet Balance</CTableHeaderCell>
              <CTableHeaderCell>Plan Amount</CTableHeaderCell>
              <CTableHeaderCell>Total Income</CTableHeaderCell>
              <CTableHeaderCell>Today Income</CTableHeaderCell>
              <CTableHeaderCell>Referral Code</CTableHeaderCell>
              <CTableHeaderCell>Sponsor</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
              <CTableHeaderCell>Review</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length === 0 ? (
              <CTableRow>
                <CTableDataCell colSpan="12" className="text-center">
                  No pending users found
                </CTableDataCell>
              </CTableRow>
            ) : (
              currentItems.map((user, index) => {
                const date = new Date(user.createdAt)
                return (
                  <CTableRow key={user._id}>
                    <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                    <CTableDataCell> {user.userId || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.phone || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{Number(user.walletBalance || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>₹{Number(user.totalPlanAmount || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>₹{Number(user.totalIncome || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>₹{Number(user.todayIncome || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{user.inviteCode || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.sponsor || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      {date.toLocaleDateString()} <br />
                      <small className="text-muted">{date.toLocaleTimeString() || 'N/A'}</small>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex gap-2 flex-wrap">
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
                        <CButton
                          size="sm"
                          color="warning"
                          onClick={() => handleSuspendUser(user.userId)}
                        >
                          Suspend
                        </CButton>
                      </div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        size="sm"
                        color="secondary"
                        onClick={() =>
                          navigate(`/user/update/${user.userId}`, {
                            state: { user, isActivated: false },
                          })
                        }
                      >
                        Review
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                )
              })
            )}
          </CTableBody>
        </CTable>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of{' '}
          {filtered.length} entries
        </div>
        <div>{renderPagination()}</div>
      </div>
    </>
  )
}

export default PendingUsersWithFilter
