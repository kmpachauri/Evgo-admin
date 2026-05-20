import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CCard,
  CCardBody,
  CSpinner,
  CForm,
} from '@coreui/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios from '../../hooks/useAxios'
import LoadingSpinner from '../common/LoadinSpinner'

const UpdateProduct = () => {
  const { userId } = useParams()
  const location = useLocation()
  const user = location.state?.user
  console.log(user)
  const navigate = useNavigate()

  const { fetchData, loading } = useAxios()

  const [form, setForm] = useState({
    title: '',
    mrp: '',
    description: '',
    category: '',
    sp: '',
    dp: '',
    shippingCharge: '',
    cgstRate: '',
    sgstRate: '',
    igstRate: '',
    hsnCode: '',
    color: '#000000',
    image: null,
  })

  const [preview, setPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      console.log(user)
      setForm({
        title: user.title || '',
        mrp: user.mrp || '',
        description: user.description || '',
        category: user.category || '',
        sp: user.sp || '',
        dp: user.dp || '',
        shippingCharge: user.shippingCharge || '',
        cgstRate: user.cgstRate || '',
        sgstRate: user.sgstRate || '',
        igstRate: user.igstRate || '',
        hsnCode: user.hsnCode || '',
        color: user.color || '#000000',
        image: null,
      })

      if (user.image) setPreview(user.image)
    }
  }, [user])


  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm((prev) => ({ ...prev, image: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      Object.keys(form).forEach((key) => {
        const value = form[key]
        if (key === 'image') {
          if (value) formData.append('image', value)
        } else if (value !== undefined && value !== null && value !== '') {
          if (['mrp', 'sp', 'dp', 'cgstRate', 'sgstRate', 'igstRate', 'shippingCharge'].includes(key)) {
            formData.append(key, Number(value))
          } else {
            formData.append(key, value)
          }
        }
      })

      const res = await fetchData({
        url: `/api/v1/admin/product/update/${userId}`,
        method: 'put',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log(res)
      if (res.success) {
        toast.success('Product updated successfully')
        navigate(-1)
      } else {
        toast.error(res.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error while updating product')
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleReset = () => {
    if (user) {
      setForm({
        title: user.title || '',
        mrp: user.mrp || '',     // <-- change here
        sp: user.sp || '',
        dp: user.dp || '',
        description: user.description || '',
        category: user.category || '',
        shippingCharge: user.shippingCharge || '',
        cgstRate: user.cgstRate || '',
        sgstRate: user.sgstRate || '',
        igstRate: user.igstRate || '',
        hsnCode: user.hsnCode || '',
        color: user.color || '#000000',
        image: null,
      })
      setPreview(user.image || null)
    }
  }


  return (
    <CCard className="p-3">
      {loading && <LoadingSpinner />}
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          {/* Row 1: Title + Category */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Title *</CFormLabel>
              <CFormInput
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Category</CFormLabel>
              <CFormSelect
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="books">Books</option>
                <option value="gadgets">Gadgets</option>
                <option value="clothing">Clothing</option>
                <option value="grocery">Grocery</option>
                <option value="test">Test</option>
              </CFormSelect>
            </CCol>
          </CRow>

          {/* Row 2: Price + MRP + SP + DP */}
          <CRow className="mb-3">
            {/* <CCol md={3}>
              <CFormLabel>Price *</CFormLabel>
              <CFormInput
                type="number"
                value={form.mrp}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
            </CCol> */}
            <CCol md={3}>
              <CFormLabel>MRP</CFormLabel>
              <CFormInput
                type="number"
                value={form.mrp}
                onChange={(e) => handleChange('mrp', e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>SP</CFormLabel>
              <CFormInput
                type="number"
                value={form.sp}
                onChange={(e) => handleChange('sp', e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>DP</CFormLabel>
              <CFormInput
                type="number"
                value={form.dp}
                onChange={(e) => handleChange('dp', e.target.value)}
              />
            </CCol>
          </CRow>

     
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>Shipping Charge</CFormLabel>
              <CFormInput
                type="number"
                value={form.shippingCharge}
                onChange={(e) => handleChange('shippingCharge', e.target.value)}
              />
            </CCol>
         
            
          </CRow>

          {/* Row 4: CGST + SGST + IGST */}
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormLabel>CGST Rate (%)</CFormLabel>
              <CFormInput
                type="number"
                value={form.cgstRate}
                onChange={(e) => handleChange('cgstRate', e.target.value)}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>SGST Rate (%)</CFormLabel>
              <CFormInput
                type="number"
                value={form.sgstRate}
                onChange={(e) => handleChange('sgstRate', e.target.value)}
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>IGST Rate (%)</CFormLabel>
              <CFormInput
                type="number"
                value={form.igstRate}
                onChange={(e) => handleChange('igstRate', e.target.value)}
              />
            </CCol>
          </CRow>

          {/* Row 5: HSN + Color */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>HSN Code</CFormLabel>
              <CFormInput
                value={form.hsnCode}
                onChange={(e) => handleChange('hsnCode', e.target.value)}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Color</CFormLabel>
              <CFormInput
                type="color"
                value={form.color}
                onChange={(e) => handleChange('color', e.target.value)}
              />
            </CCol>
          </CRow>

          {/* Description */}
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </CCol>
          </CRow>

          {/* Image Upload */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Product Image</CFormLabel>
              <CFormInput type="file" accept="image/*" onChange={handleFileChange} />
            </CCol>
            <CCol md={6}>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '180px', height: '80px', objectFit: 'contain', borderRadius: '8px' }}
                />
              ) : (
                <p>No Image</p>
              )}
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol className="d-flex gap-2">
              <CButton color="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <CSpinner size="sm" /> : 'Update Product'}
              </CButton>
              <CButton color="secondary" type="button" onClick={handleReset}>
                Reset
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default UpdateProduct
