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
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import toast from 'react-hot-toast'
import useAxios from '../../../hooks/useAxios'
import color from '../../color'
import Export from '../../Export'

const UserRewards = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [userdata, setUserdata] = useState([])
  const [filtered, setFiltered] = useState([])
  const { fetchData } = useAxios()
  const [selectedReward, setSelectedReward] = useState('')
  const [screenshotModal, setScreenshotModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const itemsPerPage = 10

  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  })

  // 🔹 Reward Levels
  const rewardLevels = [
    { level: 1, left: 200, right: 100, income: 500, ds: 'BRONZE' },
    { level: 2, left: 800, right: 400, income: 2000, ds: 'SILVER' },
    { level: 3, left: 2000, right: 1000, income: 5000, ds: 'GOLD' },
    { level: 4, left: 4400, right: 2200, income: 10000, ds: 'PLETINUM' },
    { level: 5, left: 9200, right: 4600, income: 25000, ds: 'EMERLD' },
    { level: 6, left: 18800, right: 9400, income: 75000, ds: 'TOPAZ' },
    { level: 7, left: 42800, right: 21400, income: 240000, ds: 'RUBYSTAR' },
    { level: 8, left: 90800, right: 45400, income: 380000, ds: 'SUPPHIRE' },
    { level: 9, left: 186800, right: 93400, income: 600000, ds: 'DIMOND' },
    { level: 10, left: 378800, right: 189400, income: 1200000, ds: 'ROYALDIOMOND' },
    { level: 11, left: 762800, right: 381400, income: 2400000, ds: 'CROWNDIMOND' },
  ]

  // 🔹 Fetch users by selected reward
  const getUserLists = async (ds) => {
    if (!ds) return
    try {
      const res = await fetchData({
        url: `/api/v1/admin/user/getuser-bylevel/${ds}`,
        method: 'GET',
      })

      if (res.success && Array.isArray(res.users)) {
        setUserdata(res.users)
        setFiltered(res.users)
      } else {
        setUserdata([])
        setFiltered([])
      }
    } catch (error) {
      toast.error('Failed to load user list')
      console.error('Error fetching user list:', error)
    }
  }

const handleRewardChange = (e) => {
  const selected = e.target.value
  setSelectedReward(selected)

  // हर बार clear कर दो ताकि पुराना data न दिखे
  setUserdata([])
  setFiltered([])

  if (selected && selected !== "other") {
    getUserLists(selected)
  }
}

  // 🔹 Search Filter
  const handleSearch = () => {
    let filteredList = [...userdata]

    if (filters.search.trim()) {
      const keyword = filters.search.toLowerCase().trim()
      filteredList = filteredList.filter(
        (user) =>
          user.userId?.toLowerCase().includes(keyword) ||
          user.name?.toLowerCase().includes(keyword)
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

  // 🔹 Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const renderPagination = () => {
    const pages = []
    const visiblePages = 5

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, '...', totalPages)
      else if (currentPage >= totalPages - 2)
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      else
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
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

  // 🔹 Export fields
  const fields = [
    { key: '_id', label: 'Order ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'productName', label: 'Product' },
    { key: 'productPrice', label: 'Price' },
    { key: 'quantity', label: 'Qty' },
    { key: 'netAmount', label: 'Net Amount' },
    { key: 'status', label: 'Order Status' },
  ]

  return (
    <CCard className="m-4 p-3">
      {/* 🔹 Filters */}
      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="UserId / Name"
            placeholder="Search by UserId or Name"
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

          <Export userdata={userdata} fields={fields} />
        </CCol>
      </CRow>

      {/* 🔹 Reward Dropdown */}
      <CRow className="mb-3">
        <CCol md={3}>
          <label className="fw-bold mb-1">Select Reward Level</label>
          <select
            value={selectedReward}
            onChange={handleRewardChange}
            className="form-select"
          >
            <option value="">-- Select Reward --</option>
            {rewardLevels.map((lvl) => (
              <option key={lvl.level} value={lvl.ds}>
                {lvl.ds} 
              </option>
            ))}
          </select>
        </CCol>
      </CRow>

      {/* 🔹 Users Table */}
      <CTable bordered hover responsive align="middle" className="border">
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>User ID</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Phone</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Gender</CTableHeaderCell>
            <CTableHeaderCell>Marital Status</CTableHeaderCell>
            <CTableHeaderCell>Wallet</CTableHeaderCell>
            <CTableHeaderCell>Today Income</CTableHeaderCell>
            <CTableHeaderCell>Total Income</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                <CTableDataCell>{user.userId || 'N/A'}</CTableDataCell>
                <CTableDataCell>{`${user.title || ''} ${user.name || 'N/A'}`}</CTableDataCell>
                <CTableDataCell>{user.phone || 'N/A'}</CTableDataCell>
                <CTableDataCell>{user.email || 'N/A'}</CTableDataCell>
                <CTableDataCell>{user.gender || 'N/A'}</CTableDataCell>
                <CTableDataCell>{user.maritalStatus || 'N/A'}</CTableDataCell>
                <CTableDataCell>{user.walletBalance || 0}</CTableDataCell>
                <CTableDataCell>{user.todayIncome || 0}</CTableDataCell>
                <CTableDataCell>{user.totalIncome || 0}</CTableDataCell>
                <CTableDataCell>
                  {user.isBlocked ? (
                    <span className="text-danger fw-semibold">Blocked</span>
                  ) : (
                    <span className="text-success fw-semibold">Active</span>
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="info"
                    className="text-white"
                    onClick={() => {
                      setSelectedUser(user)
                      setScreenshotModal(true)
                    }}
                  >
                    View
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="12" className="text-center text-muted">
                No users found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <CPagination align="center">
            {renderPagination()}
          </CPagination>
        </div>
      )}

      {/* 🔹 User Detail Modal */}
      <CModal visible={screenshotModal} onClose={() => setScreenshotModal(false)} size="xl">
        <CModalHeader closeButton>
          <CModalTitle>User Details</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {selectedUser && (
            <CRow className="g-4 p-3">
              {[
                ['User ID', selectedUser.userId],
                ['Name', `${selectedUser.title || ''} ${selectedUser.name}`],
                ['Phone', selectedUser.phone],
                ['Email', selectedUser.email],
                ['Gender', selectedUser.gender],
                ['DOB', selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'],
                ['Marital Status', selectedUser.maritalStatus],
                ['Relation', `${selectedUser.relationType || ''} ${selectedUser.relationName || ''}`],
                ['Sponsor', selectedUser.sponsor],
                ['Referral Code', selectedUser.referralCode],
                ['User Level', selectedUser.userAtlevel],
                ['Wallet Balance', `₹${selectedUser.walletBalance || 0}`],
                ['Today Income', `₹${selectedUser.todayIncome || 0}`],
                ['Total Income', `₹${selectedUser.totalIncome || 0}`],
                ['Left Carry', selectedUser.leftCarry],
                ['Right Carry', selectedUser.rightCarry],
                ['Left Team', selectedUser.leftteam],
                ['Right Team', selectedUser.rightteam],
                ['Active', selectedUser.isActivated ? 'Yes' : 'No'],
                ['Binary Started', selectedUser.isBinaryStarted ? 'Yes' : 'No'],
                ['Blocked', selectedUser.isBlocked ? 'Yes' : 'No'],
                ['Created At', new Date(selectedUser.createdAt).toLocaleString()],
                ['Updated At', new Date(selectedUser.updatedAt).toLocaleString()],
              ].map(([label, value], i) => (
                <CCol md={4} key={i}>
                  <p><strong>{label}:</strong> {value || 'N/A'}</p>
                </CCol>
              ))}
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setScreenshotModal(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default UserRewards
