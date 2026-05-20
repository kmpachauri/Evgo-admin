import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CFormInput,
  CFormSelect,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import useAxios, { loginUrl } from '../../../hooks/useAxios'
import ImagePreviewModal from '../../../components/common/ImageViewModal'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../components/common/LoadinSpinner'
import apiRoutes from '../../../variables/apiRoutes'
import { exportToExcel, exportToPDF, exportToWordPress } from '../../../help/DownloadFiles'
import color from '../../color'
import Export from '../../Export'
import Swal from 'sweetalert2'

const SettingsTable = () => {
  const { fetchData, loading } = useAxios()
  const [settings, setSettings] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [filtered, setFiltered] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  })

  const navigate = useNavigate()

  const getUserLists = async () => {
    try {
      const data = await fetchData({
        url: apiRoutes.activeUsers,
        method: 'GET',
      })
      if (data?.users) {
        setSettings(data.users)
        setFiltered(data.users) // default full list
      } else {
        toast.error('No users found')
      }
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  useEffect(() => {
    getUserLists()
  }, [])

  const loginAsUser = async (id, userId) => {
    try {
      const data = await fetchData({
        url: `/api/v1/admin/user/login-as-user/${id}`,
        method: 'get',
      })
      if (data.success) {
        const token = data?.data.token
        const redirectUrl = `${loginUrl}/login?userId=${userId}&token=${token}`
        window.open(redirectUrl, "_blank", "noopener,noreferrer")
      }
    } catch (error) {
      toast.error('Login as user failed')
    }
  }
 

  const Suspendeduser = async (userId) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You want to Suspended this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Suspended",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (userId === 'ABC75159') {
            // toast.error('Normal users can be suspended by an admin.')
            Swal.fire("Approved!", "Normal users can be suspended by an admin.", "success");
            return
          }
          const res = await fetchData({
            url: `/api/v1/admin/user/unblockuser/${userId}`,
            method: 'PATCH',
            data: { status: true },
          })
          if (res?.message) {
            toast.success('User suspended successfully')
            getUserLists()
          }
        } catch (error) {
          toast.error('Failed to suspend user')
        }
      }
    });
  }

  const handleSearch = () => {
    let filteredList = [...settings]

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
    setFiltered(settings) // reset to full list
    setCurrentPage(1)
  }

  // pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)

  const PaginationControls = () => {
    const visiblePages = 5
    const pages = []

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {settings.length} users
        </div>
        <div className="d-flex gap-1 flex-wrap">
          {pages.map((p, index) =>
            p === '...' ? (
              <CButton key={`ellipsis-${index}`} disabled color="light" size="sm">
                ...
              </CButton>
            ) : (
              <CButton
                key={p}
                size="sm"
                color={p === currentPage ? 'dark' : 'light'}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </CButton>
            )
          )}
        </div>
      </div>
    )
  }

  const fields = [
    { key: "userId", label: "User Id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "phone" },
    { key: "walletBalance", label: "Wallet Balance" },
    { key: "sponsor", label: "Sponsor" },
  ];


  return (
    <CCard className="mb-4">
      {loading && <LoadingSpinner />}
      <CCardBody>
        {/* Filters */}
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
            <Export userdata={settings} fields={fields} />

          </CCol>



          {/* Export Dropdown */}


        </CRow>

        {/* Table */}
        <div className="table-responsive">
          <CTable align="middle" bordered hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="text-center">S.No.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">UserId</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Phone</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Wallet Balance</CTableHeaderCell>
                {/* <CTableHeaderCell className="text-center">Earning</CTableHeaderCell> */}
                <CTableHeaderCell className="text-center">Sponsor</CTableHeaderCell>
                {/* <CTableHeaderCell className="text-center">Passowrd</CTableHeaderCell> */}
                <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Login</CTableHeaderCell>
           
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length > 0 ? (
                currentItems.map((user, key) => {
                  const date = new Date(user.createdAt)
                  return (
                    <CTableRow key={user._id}>
                      <CTableDataCell className="text-center">{indexOfFirst + key + 1}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.userId || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.name || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.email || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.phone || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{Number(user?.walletBalance).toFixed(2) || 0}</CTableDataCell>
                      {/* <CTableDataCell className="text-center">{Number(user?.totalProfitEarned).toFixed(2) || 0}</CTableDataCell> */}
                      <CTableDataCell className="text-center">{user?.sponsor || "N/A"}</CTableDataCell>
                      {/* <CTableDataCell className="text-center">{user?.forAdminPass || "N/A"}</CTableDataCell> */}
                      <CTableDataCell className="text-center">
                        {date.toLocaleDateString()} <br />
                        <small className="text-muted">{date.toLocaleTimeString()}</small>
                      </CTableDataCell>
                      <CTableDataCell className="text-center d-flex justify-content-center gap-2 flex-wrap">
                        <CButton
                          color="info"
                          size="sm"
                          title="Edit"
                          disabled={user?.role === 'admin'}
                          onClick={() => navigate(`/user/update/${user.userId}`, { state: { user, isActivated: true } })}
                          style={{
                            background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                            color: 'white',
                          }}
                        >
                          ✎
                        </CButton>
                        <CButton
                          size="sm"
                          title="Suspend"
                          disabled={user?.role === 'admin'}
                          onClick={() => Suspendeduser(user.userId)}
                          style={{ backgroundColor: '#FF0707', borderColor: '#dc3545', color: '#ffffff' }}
                        >
                          Suspend
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          disabled={user?.role === 'admin'}
                          size="sm"
                          onClick={() => loginAsUser(user._id, user.userId)}
                          style={{
                            background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                            color: 'white',
                          }}
                        >
                          Login
                        </CButton>
                      </CTableDataCell>
              
                    </CTableRow>
                  )
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="10" className="text-center">
                    No users found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Pagination */}
        <PaginationControls />
      </CCardBody>

      {/* Image Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </CCard>
  )
}

export default SettingsTable
