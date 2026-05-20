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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import useAxios, { imgBaseUrl } from '../../../hooks/useAxios'
import { exportToExcel, exportToPDF, exportToWordPress } from '../../../help/DownloadFiles'
import Swal from 'sweetalert2'
import color from '../../color'
import Export from '../../Export'

const UserKyc = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [userdata, setUserdata] = useState([])
  const [filtered, setFiltered] = useState([])
  const { fetchData, loading } = useAxios()
  const normalizePath = (path) => path?.replace(/\\/g, "/");
  const navigate = useNavigate()

  const [screenshotModal, setScreenshotModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 10
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  })


  const getUserLists = async () => {
    try {
      const data = await fetchData({
        url: '/api/v1/admin/user/getuser-userkKyc',
        method: 'GET',
      })

      if (data.success) {
        setUserdata(data.data)
        setFiltered(data.data)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleApprove = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to APPROVE this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetchData({
            url: `/api/v1/admin/user/userKyc/${id}`,
            method: 'PUT',
            data: { status: 'approved' },
          });

          if (res?.success) {
            // toast.success(res.message || 'Withdrawal approved successfully');
            Swal.fire("Approved!", res.message || "The request has been approved.", "success");
            getUserLists(); // refresh list
          } else {
            // toast.error(res.message || 'Failed to approve withdrawal');
            Swal.fire("Error!", res?.message || "Failed to approve withdrawal", "error");
          }
        } catch (err) {
          // toast.error('Error approving withdrawal');
          Swal.fire("Error!", "Error approving withdrawal", "error");
        }
      }
    });
  };


  useEffect(() => {
    getUserLists()
  }, [])

  const handleSearch = () => {
    let filteredList = [...userdata]

    if (filters.search) {
      const searchText = filters.search.toLowerCase().trim()

      filteredList = filteredList.filter((user) => {
        const userId = user.user_id?.userId?.toLowerCase() || ""
        const userName = user.user_id?.name?.toLowerCase() || ""
        const userEmail = user.user_id?.email?.toLowerCase() || ""
        const userPhone = String(user.user_id?.phone || "")

        return (
          userId.includes(searchText) ||
          userName.includes(searchText) ||
          userEmail.includes(searchText) ||
          userPhone.includes(searchText)
        )
      })
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
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) pages.push(1, 2, 3, 4, '...', totalPages)
      else if (currentPage >= totalPages - 2)
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      else pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
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
    { key: (user) => user.user_id?.userId || 'N/A', label: 'User Id' },
    { key: (row) => row.user_id?.name || 'N/A', label: 'Name' },
    { key: (row) => row.user_id?.email || 'N/A', label: 'Email' },
    { key: (row) => row.user_id?.phone || 'N/A', label: 'Phone' },
    { key: 'documentType', label: 'Document Type' },
    { key: 'documentNumber', label: 'Document Number' },
    { key: 'status', label: 'Status' },
  ]




  return (
    <CCard className="mb-4">
      <CCardBody>
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

        {loading ? (
          <div className="text-center py-5">
            <CSpinner color="primary" />
          </div>
        ) : (
          <>
            <CTable striped bordered hover responsive>
              <CTableHead color="primary">
                <CTableRow>
                  <CTableHeaderCell>Sr. No</CTableHeaderCell>
                  <CTableHeaderCell>User Id</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Mobile No</CTableHeaderCell>
                  <CTableHeaderCell>Document Type</CTableHeaderCell>
                  <CTableHeaderCell>Document Number</CTableHeaderCell>
                  <CTableHeaderCell>Document Front</CTableHeaderCell>
                  <CTableHeaderCell>Document Back</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {paginatedUsers.map((user, index) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell>{(currentPage - 1) * itemsPerPage + index + 1}</CTableDataCell>
                    {/* <CTableDataCell>{user.user_id.userId || 'N/A'}</CTableDataCell> */}
                    <CTableDataCell>{user.user_id?.userId || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.user_id?.name || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.user_id?.email || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.user_id?.phone || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.documentType || 'N/A'}</CTableDataCell>
                    <CTableDataCell>{user.documentNumber || 'N/A'}</CTableDataCell>
                    <CTableDataCell>
                      {user.documentFront ? (
                        <img
                        src={`${imgBaseUrl}${normalizePath(user.documentFront)}`}
                        alt="Passbook"
                        style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedImage(`${imgBaseUrl}${normalizePath(user.documentFront)}`);
                          setScreenshotModal(true);
                        }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {user.documentBack ? (
                        <img
                        src={`${imgBaseUrl}${normalizePath(user.documentBack)}`}
                        alt="Passbook"
                        style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedImage(`${imgBaseUrl}${normalizePath(user.documentBack)}`);
                          setScreenshotModal(true);
                        }}
                        />
                      ) : (
                        'No Image'
                      )}
                    </CTableDataCell>
                      <CTableDataCell>{user.status || 'N/A'}</CTableDataCell>
                    {/* <CTableDataCell>
                      <Link to={`/bank/kyc/`}>
                        <CButton color="primary" size="sm">
                          View KYC
                        </CButton>
                      </Link>
                    </CTableDataCell> */}
                    <CTableDataCell>
                      {new Date(user.createdAt).toLocaleDateString()} <br />
                      <small className="text-muted">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </small>
                    </CTableDataCell>

                    <CTableDataCell>
                      {/* <CButton
                        color="success"
                        size="sm"
                        className="me-2 text-white"
                        onClick={() => handleApprove(user._id)}
                        disabled={user.status !== "pending"} // ✅ disable if not pending
                      >
                        Approve
                      </CButton> */}

                      <CTableDataCell>
                        {user.status === "pending" ? (
                          <CButton
                            color="success"
                            size="sm"
                            className="me-2 text-white"
                            onClick={() => handleApprove(user._id)}
                          >
                            Approve
                          </CButton>
                        ) : (
                          <span className="text-success fw-bold">Approved</span>
                        )}
                      </CTableDataCell>

                      {/* <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleReject(item._id)}
                        disabled={item.status !== "pending"} // ✅ disable if not pending
                      >
                        Reject
                      </CButton> */}
                    </CTableDataCell>



                    <CModal
                      visible={screenshotModal}
                      onClose={() => setScreenshotModal(false)}
                      size="lg"
                    >
                      <CModalHeader>
                        <CModalTitle>Preview Image</CModalTitle>
                      </CModalHeader>
                      <CModalBody className="text-center">
                        {selectedImage && (
                          <img
                            src={selectedImage}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '10px' }}
                          />
                        )}
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setScreenshotModal(false)}>
                          Close
                        </CButton>
                      </CModalFooter>
                    </CModal>
                  </CTableRow>


                ))}
              </CTableBody>
            </CTable>

            <CPagination align="center" className="mt-3 flex-wrap">
              {renderPagination()}
            </CPagination>
          </>
        )}
      </CCardBody>
    </CCard>
  )
}

export default UserKyc
