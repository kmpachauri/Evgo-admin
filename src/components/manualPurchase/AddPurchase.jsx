import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'

const initialForm = {
  userId: '',
  billNumber: '',
  billDate: '',
  productName: '',
  designName: '',
  materialType: '',
  quantity: '1',
  unit: 'pcs',
  rate: '',
  amount: '',
  remarks: '',
}

const AddPurchase = () => {
  const { fetchData } = useAxios()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [formData, setFormData] = useState(initialForm)

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.userId || !formData.productName || !formData.amount) {
      showAlert('User ID, product name and amount are required', 'warning')
      return
    }

    setLoading(true)
    try {
      const res = await fetchData({
        url: '/api/v1/admin/purchase-bills/add',
        method: 'POST',
        data: {
          ...formData,
          quantity: Number(formData.quantity || 1),
          rate: Number(formData.rate || 0),
          amount: Number(formData.amount),
        },
      })

      if (res.success) {
        showAlert(
          `Bill added. Direct 5%: Rs ${Number(res.data.directIncomeAmount || 0).toFixed(2)}, Team pool 10%: Rs ${Number(res.data.binaryPoolAmount || 0).toFixed(2)}`,
          'success',
        )
        setFormData(initialForm)
      }
    } catch (error) {
      showAlert(error?.message || 'Failed to add purchase bill', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const amount = Number(formData.amount || 0)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Wallpaper Purchase Bill</strong>
          </CCardHeader>
          <CCardBody>
            {alert.show && (
              <CAlert color={alert.color} dismissible onClose={() => setAlert({ show: false })}>
                {alert.message}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>User ID *</CFormLabel>
                  <CFormInput name="userId" value={formData.userId} onChange={handleChange} placeholder="DT00001" required />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Bill Number</CFormLabel>
                  <CFormInput name="billNumber" value={formData.billNumber} onChange={handleChange} placeholder="Invoice / bill no." />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Bill Date</CFormLabel>
                  <CFormInput type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Product / Wallpaper Name *</CFormLabel>
                  <CFormInput name="productName" value={formData.productName} onChange={handleChange} placeholder="Wallpaper / PVC panel / decor item" required />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Design Name / Code</CFormLabel>
                  <CFormInput name="designName" value={formData.designName} onChange={handleChange} placeholder="Design code or pattern" />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Material Type</CFormLabel>
                  <CFormInput name="materialType" value={formData.materialType} onChange={handleChange} placeholder="Vinyl, 3D, texture, custom" />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={3} className="mb-3">
                  <CFormLabel>Quantity</CFormLabel>
                  <CFormInput type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" />
                </CCol>
                <CCol md={3} className="mb-3">
                  <CFormLabel>Unit</CFormLabel>
                  <CFormInput name="unit" value={formData.unit} onChange={handleChange} placeholder="roll, sq.ft, pcs" />
                </CCol>
                <CCol md={3} className="mb-3">
                  <CFormLabel>Rate</CFormLabel>
                  <CFormInput type="number" name="rate" value={formData.rate} onChange={handleChange} min="0" step="0.01" />
                </CCol>
                <CCol md={3} className="mb-3">
                  <CFormLabel>Amount *</CFormLabel>
                  <CFormInput type="number" name="amount" value={formData.amount} onChange={handleChange} min="1" step="0.01" required />
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel>Remarks</CFormLabel>
                <CFormTextarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} />
              </div>

              {amount > 0 && (
                <CAlert color="info">
                  Direct sponsor income: Rs {(amount * 0.05).toFixed(2)}. Team binary pool: Rs {(amount * 0.10).toFixed(2)}. Total business payout is capped at 15%.
                </CAlert>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add Bill'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddPurchase
