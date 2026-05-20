import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
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
  CDropdownItem,
  CFormSelect
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios, { imgBaseUrl } from '../../hooks/useAxios'
import ImagePreviewModal from '../common/ImageViewModal'
import LoadingSpinner from '../common/LoadinSpinner'
import { exportToExcel, exportToPDF, exportToWordPress } from '../../help/DownloadFiles'
import color from '../../views/color'
import Export from '../../views/Export'
import Swal from 'sweetalert2'

const ProductCreate = () => {
  const { fetchData, loading } = useAxios()
  const [settings, setSettings] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [visible, setVisible] = useState(false)
  const [imageModal, setImageModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [netAmounts, setNetAmounts] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    productCode: '',
    category: '',
    description: '',
    mrp: 0,
    sp: 0,
    dp: 0,
    shippingCharge: 0,

    cgstRate: 0,
    sgstRate: 0,
    igstRate: 0,
    netAmount: 0,
    hsnCode: '',
    color: '',
    image: null,
  })


  const [preview, setPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const itemsPerPage = 10
  const normalizePath = (path) => path?.replace(/\\/g, "/");
  const navigate = useNavigate()

  const getUserLists = async () => {
    try {
      const data = await fetchData({
        url: '/api/v1/admin/product/get-all',
        method: 'GET',
      })
      if (data?.success) {
        setSettings(data.data || [])
      } else {
        toast.error('No products found')
      }
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  useEffect(() => {
    getUserLists()
  }, [])



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update formData
    const updatedForm = { ...formData, [name]: value };

    // Convert relevant fields to numbers safely
    const dp = Number(updatedForm.dp) || 0;
    const cgstRate = Number(updatedForm.cgstRate) || 0;
    const sgstRate = Number(updatedForm.sgstRate) || 0;
    const igstRate = Number(updatedForm.igstRate) || 0;
    const shippingChargeNum = Number(updatedForm.shippingCharge) || 0;



    // Calculate amounts based on DP
    const taxAmount = dp * ((cgstRate + sgstRate + igstRate) / 100);


    // Final net amount
    const netAmount = dp + taxAmount + shippingChargeNum;

    // Update formData with calculated fields


    updatedForm.netAmount = netAmount;

    setFormData(updatedForm);
    setNetAmounts(netAmount);
  };








  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = {
      ...formData,
      netAmount: netAmounts,
    };


    const postData = new FormData();
    Object.keys(updatedForm).forEach((key) => {
      const value = updatedForm[key];
      if (value !== null && value !== undefined) {
        postData.append(key, value);
      }
    });


    try {
      setIsSubmitting(true);
      const res = await fetchData({
        url: '/api/v1/admin/product/create',
        method: 'POST',
        data: postData,
      });


      if (res.success) {
        toast.success('Product uploaded successfully');

        // Fetch full product details immediately
        const fullData = await fetchData({
          url: `/api/v1/admin/product/get/${res.data._id}`,
          method: 'GET',
        });

        if (fullData?.success) {
          setSettings((prev) => [fullData.data, ...prev]);
        }

        setVisible(false);
        setFormData({
          title: '',
          description: '',
          productCode: '',
          category: '',
          mrp: '',
          sp: '',
          dp: '',
          shippingCharge: '',
          cgstRate: 0,
          sgstRate: 0,
          igstRate: '',
          netAmount: '',
          hsnCode: '',
          color: '',
          image: null,
        });
        setPreview(null);
      } else {
        toast.error('Failed to Create product');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to Create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Suspendeduser = async (userId) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You want to Delete this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetchData({
            url: `/api/v1/admin/product/delete/${userId}`,
            method: 'DELETE',
            data: { status: true },
          });

          if (res?.message) {
            toast.success('Product deleted successfully');
            getUserLists();
          }
        } catch (error) {
          toast.error('Failed to delete product');
          console.log(error)
        }
      }
    });
  };

  const filteredSettings = settings.filter(
    (item) =>
      item.title?.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      item.description?.toLowerCase().includes(filterText.toLowerCase().trim()) ||
      item.mrp?.toString().includes(filterText.toLowerCase().trim()) ||
      item.sp?.toString().includes(filterText.toLowerCase().trim()) ||
      item.dp?.toString().includes(filterText.toLowerCase().trim()) ||
      item._id?.toString().includes(filterText.toLowerCase().trim())
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
    { key: "title", label: "Title" },
    { key: "sp", label: "SP" },
    { key: "dp", label: "DP" },
    { key: "mrp", label: "MRP" },
    { key: "description", label: "Description" },
  ];

  return (
    <CCard className="mb-4">
      {loading && <LoadingSpinner />}
      <CCardBody>
        <CCol sm={6} className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Search by Title, Description, Price, or ID"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="form-control me-2 flex-grow-1"
          />

          <CButton
            onClick={() => setVisible(true)}
            style={{
              background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
              color: 'white',
              marginRight: '10px',
            }}
            className="d-flex align-items-center justify-content-center text-nowrap"
          >
            + Add Product
          </CButton>
          <Export userdata={settings} fields={fields} />
        </CCol>

        {/* Product Modal */}
        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)} size="xl">
          <CModalHeader onClose={() => setVisible(false)}>
            <strong>Add New Product</strong>
          </CModalHeader>
          <CModalBody style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1rem' }}>
            <CForm onSubmit={handleSubmit}>
              {/* Row 1: Title + Product Code + Category */}
              <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">Title *</CFormLabel>
                  <CFormInput name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">Category</CFormLabel>
                  <CFormSelect
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Books</option>
                    <option value="gadgets">Gadgets</option>
                    <option value="clothing">Clothing</option>
                    <option value="grocery">Grocery</option>
                    <option value="test">Test</option>
                  </CFormSelect>
                </div>
              </div>

              {/* Row 2: MRP + SP + DP */}
              <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">MRP *</CFormLabel>
                  <CFormInput name="mrp" type="number" value={formData.mrp} onChange={handleInputChange} required />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">SP *</CFormLabel>
                  <CFormInput name="sp" type="number" value={formData.sp} onChange={handleInputChange} required />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">DP *</CFormLabel>
                  <CFormInput name="dp" type="number" value={formData.dp} onChange={handleInputChange} required />
                </div>
              </div>


              <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">Shipping Charge</CFormLabel>
                  <CFormInput name="shippingCharge" type="number" value={formData.shippingCharge} onChange={handleInputChange} />
                </div>

              </div>

              {/* Row 4: CGST + SGST + IGST */}
              <div className="d-flex gap-3 mb-3">
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">CGST Rate (%)</CFormLabel>
                  <CFormInput name="cgstRate" type="number" value={formData.cgstRate} onChange={handleInputChange} />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">SGST Rate (%)</CFormLabel>
                  <CFormInput name="sgstRate" type="number" value={formData.sgstRate} onChange={handleInputChange} />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">IGST Rate (%)</CFormLabel>
                  <CFormInput name="igstRate" type="number" value={formData.igstRate} onChange={handleInputChange} />
                </div>
              </div>

              {/* Row 5: Net Amount + HSN + Color */}
              <div className="d-flex gap-3 mb-3">

                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">HSN Code</CFormLabel>
                  <CFormInput name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">Color</CFormLabel>
                  <CFormInput type="color" name="color" value={formData.color} onChange={handleInputChange} />
                </div>
                <div className="flex-grow-1">
                  <CFormLabel className="fw-semibold">Net Amount</CFormLabel>
                  <CFormInput
                    name="netAmount"
                    type="number"
                    value={formData.netAmount}
                    readOnly
                  />
                </div>

              </div>

              {/* Description */}
              <div className="mb-3">
                <CFormLabel className="fw-semibold">Description</CFormLabel>
                <CFormTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <CFormLabel className="fw-semibold">Product Image *</CFormLabel>
                <CFormInput type="file" accept="image/*" onChange={handleImageChange} required />
              </div>

              {/* Image Preview */}
              {preview && (
                <div className="mb-3 text-center">
                  <img src={preview} alt="Preview" style={{ maxHeight: '120px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <div className="text-muted small mt-1">Image Preview</div>
                </div>
              )}
            </CForm>
          </CModalBody>

          <CModalFooter style={{ padding: '1rem', borderTop: '1px solid #dee2e6' }}>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <CSpinner size="sm" /> : 'Create Product'}
            </CButton>
          </CModalFooter>
        </CModal>


        {/* Table */}
        <div className="table-responsive mt-4">
          <CTable align="middle" bordered hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="text-center">S.No.</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Product Code</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Title</CTableHeaderCell>
                <CTableHeaderCell className="text-center">MRP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">SP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">DP</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Shipping Charge</CTableHeaderCell>


                <CTableHeaderCell className="text-center">CGST Rate</CTableHeaderCell>
                <CTableHeaderCell className="text-center">SGST Rate</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Net Amount</CTableHeaderCell>
                <CTableHeaderCell className="text-center">IGST Rate</CTableHeaderCell>
                <CTableHeaderCell className="text-center">HSN Code</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Category</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Description</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Image</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length > 0 ? (
                currentItems.map((user, key) => (
                  <CTableRow key={user._id}>
                    <CTableDataCell className="text-center">{indexOfFirst + key + 1}</CTableDataCell>
                    <CTableDataCell className="text-center">#{user?.productCode || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.title || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.mrp || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.sp || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.dp || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.shippingCharge || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.cgstRate || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.sgstRate || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.netAmount || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.igstRate || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.hsnCode || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.category || "N/A"}</CTableDataCell>
                    <CTableDataCell className="text-center">{user?.description || "N/A"}</CTableDataCell>

                    <CTableDataCell>
                      {user.image ? (
                        <img
                          src={`${imgBaseUrl}${normalizePath(user.image)}`}
                          alt="product"
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

                    <CTableDataCell className="text-center d-flex justify-content-center gap-2 flex-wrap">
                      <CButton
                        color="info"
                        size="sm"
                        title="Edit"
                        onClick={() => navigate(`/product/update/${user._id}`, { state: { user } })}
                        style={{
                          background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                          color: 'white',
                        }}
                      >
                        ✎
                      </CButton>
                      <CButton
                        size="sm"
                        title="Delete"
                        onClick={() => Suspendeduser(user._id)}
                        style={{ backgroundColor: '#FF0707', borderColor: '#dc3545', color: '#ffffff' }}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="8" className="text-center">
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

export default ProductCreate
