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
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CSpinner, CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios, { imgBaseUrl } from '../../hooks/useAxios'
import ImagePreviewModal from '../common/ImageViewModal'
import LoadingSpinner from '../common/LoadinSpinner'
import apiRoutes from '../../variables/apiRoutes'
import { exportToExcel, exportToPDF, exportToWordPress } from '../../help/DownloadFiles'
import color from '../../views/color'

const PurchaseProduct = () => {
  const { fetchData, loading } = useAxios()
  const [settings, setSettings] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [imageModal, setImageModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  })
  const [preview, setPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const itemsPerPage = 10
  const normalizePath = (path) => path?.replace(/\\/g, "/");
  const navigate = useNavigate()

  const getUserLists = async () => {
    try {
      const data = await fetchData({
        url: '/api/v1/admin/product/history',
        method: 'GET',
      })
      if (data?.success) {
        setSettings(data.data || [])
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    postData.append('title', formData.title)
    postData.append('description', formData.description)
    postData.append('price', formData.price)
    if (formData.image) postData.append('image', formData.image)

    try {
      setIsSubmitting(true)
      const res = await fetchData({
        url: '/api/v1/admin/product/create',
        method: 'POST',
        data: postData
      })
      if (res.success) {
        toast.success('Product uploaded successfully')
        setVisible(false)
        setFormData({ title: '', description: '', price: '', image: null })
        setPreview(null)
        getUserLists()
      } else {
        toast.error('Failed to upload product')
      }
    } catch (err) {
      console.error('Error uploading product:', err)
      toast.error('Failed to upload product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const Suspendeduser = async (userId) => {
    try {
      if (userId === 'ABC75159') {
        toast.error('Normal users can be suspended by an admin.');
        return;
      }
      const res = await fetchData({
        url: `/api/v1/admin/product/delete/${userId}`,
        method: 'DELETE',
        data: { status: true },
      });

      if (res?.message) {
        toast.success('User suspended successfully');
        getUserLists();
      }
    } catch (error) {
      toast.error('Failed to sespended user');
      console.log(error)
    }
  };

  const filteredSettings = settings.filter(
    (item) =>
      item.userId?.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      item.name?.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      item.title?.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      item.price?.toString().includes(filterText.toLowerCase().trim())

  )

  const totalPages = Math.ceil(filteredSettings.length / itemsPerPage)
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filteredSettings.slice(indexOfFirst, indexOfLast)

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
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredSettings.length)} of{' '}
          {settings.length} products
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
    { key: "title", label: "Title" },
    { key: "mrp", label: "MRP" },
    { key: "sp", label: "SP" },
    { key: "dp", label: "DP" },
  ];

  return (
    <CCard className="mb-4">
      {loading && <LoadingSpinner />}
      <CCardBody>

        <CCol sm={6} className="d-flex  gap-2">
          <input
            type="text"
            placeholder="Search"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-control w-50 me-2"
          />

          <CDropdown>
            <CDropdownToggle
              style={{
                background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                border: 'none',
                color: 'white'
              }}
            >
              Export
            </CDropdownToggle>

            <CDropdownMenu
              style={{
                background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
              }}
            >
              <CDropdownItem onClick={() => exportToExcel(settings, fields)}>Excel</CDropdownItem>
              <CDropdownItem onClick={() => exportToPDF(settings, fields)}>PDF</CDropdownItem>
              <CDropdownItem onClick={() => exportToWordPress(settings, fields)}>Word</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>

        {/* Product Modal */}
        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <strong>Upload New Product</strong>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit}>
              <CFormLabel>Title</CFormLabel>
              <CFormInput
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <CFormLabel className="mt-2">Description</CFormLabel>
              <CFormTextarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />

              <CFormLabel className="mt-2">Price (₹)</CFormLabel>
              <CFormInput
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />

              <CFormLabel className="mt-2">Image</CFormLabel>
              <CFormInput type="file" accept="image/*" onChange={handleImageChange} required />

              {preview && (
                <div className="mt-2 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxHeight: '150px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <CSpinner size="sm" /> : 'Upload'}
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Table */}
        <div className="table-responsive mt-4">
          <CTable align="middle" bordered hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="text-center">S.No.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">User Id</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Title</CTableHeaderCell>
                <CTableHeaderCell className="text-center">MRP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">SP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">DP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Image</CTableHeaderCell>
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
                      <CTableDataCell className="text-center">{user?.title || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.mrp || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.sp || "N/A"}</CTableDataCell>
                      <CTableDataCell className="text-center">{user?.dp || "N/A"}</CTableDataCell>


                      <CTableDataCell>
                        {user.image ? (
                          <img
                            src={`${imgBaseUrl}${normalizePath(user.image)}`}
                            alt="Pancard"
                            style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px', cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedImage(`${imgBaseUrl}${normalizePath(user.image)}`);
                              setImageModal(true);
                            }}
                          />
                        ) : (
                          'No Image'
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No products found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/* Pagination */}
        <PaginationControls />

        {/* Image Preview */}
        <ImagePreviewModal
          imageUrl={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </CCardBody>
    </CCard>
  )
}

export default PurchaseProduct
