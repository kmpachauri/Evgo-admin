import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'

const emptyForm = {
  id: '',
  code: '',
  rewardAmount: '',
  expiryDate: '',
  status: 'active',
  usageLimit: 1,
  singleUsePerUser: true,
  description: '',
}

const CouponManagement = () => {
  const { fetchData } = useAxios()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [coupons, setCoupons] = useState([])
  const [redeems, setRedeems] = useState([])
  const [analytics, setAnalytics] = useState({ totalCoupons: 0, totalRedeemedAmount: 0, totalRedeems: 0 })

  const loadData = async () => {
    try {
      setLoading(true)
      const [couponRes, redeemRes] = await Promise.all([
        fetchData({ url: '/api/v1/admin/coupons' }),
        fetchData({ url: '/api/v1/admin/coupons/redeems' }),
      ])

      if (couponRes.success) {
        setCoupons(couponRes.data.coupons || [])
        setAnalytics(couponRes.data.analytics || {})
      }
      if (redeemRes.success) {
        setRedeems(redeemRes.data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const payload = {
        code: form.code,
        rewardAmount: Number(form.rewardAmount || 0),
        expiryDate: form.expiryDate || null,
        status: form.status,
        usageLimit: Number(form.usageLimit || 1),
        singleUsePerUser: Boolean(form.singleUsePerUser),
        description: form.description,
      }

      if (form.id) {
        await fetchData({ url: `/api/v1/admin/coupons/${form.id}`, method: 'PUT', data: payload })
      } else {
        await fetchData({ url: '/api/v1/admin/coupons', method: 'POST', data: payload })
      }

      setForm(emptyForm)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (coupon) => {
    const formatExpiry = coupon.expiryDate
      ? new Date(new Date(coupon.expiryDate).getTime() - new Date(coupon.expiryDate).getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : ''

    setForm({
      id: coupon._id,
      code: coupon.code,
      rewardAmount: coupon.rewardAmount,
      expiryDate: formatExpiry,
      status: coupon.status,
      usageLimit: coupon.usageLimit,
      singleUsePerUser: coupon.singleUsePerUser !== false,
      description: coupon.description || '',
    })
  }

  const handleDelete = async (id) => {
    await fetchData({ url: `/api/v1/admin/coupons/${id}`, method: 'DELETE' })
    if (form.id === id) setForm(emptyForm)
    await loadData()
  }

  if (loading) {
    return <div className="text-center p-5"><CSpinner color="primary" /></div>
  }

  return (
    <CRow>
      <CCol lg={4}>
        <CCard className="mb-4">
          <CCardHeader><strong>{form.id ? 'Edit Coupon' : 'Create Coupon'}</strong></CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormLabel>Coupon Code</CFormLabel>
                <CFormInput value={form.code} onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} required />
              </div>
              <div className="mb-3">
                <CFormLabel>Reward Amount</CFormLabel>
                <CFormInput type="number" value={form.rewardAmount} onChange={(e) => setForm((prev) => ({ ...prev, rewardAmount: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <CFormLabel>Expiry Date & Time</CFormLabel>
                <CFormInput type="datetime-local" value={form.expiryDate} onChange={(e) => setForm((prev) => ({ ...prev, expiryDate: e.target.value }))} />
              </div>
              <div className="mb-3">
                <CFormLabel>Status</CFormLabel>
                <CFormSelect value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="expired">Expired</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Usage Limit</CFormLabel>
                <CFormInput type="number" min="1" value={form.usageLimit} onChange={(e) => setForm((prev) => ({ ...prev, usageLimit: e.target.value }))} disabled/>
              </div>
              <div className="mb-3">
                <CFormCheck label="Single use per user" checked={form.singleUsePerUser} onChange={(e) => setForm((prev) => ({ ...prev, singleUsePerUser: e.target.checked }))} />
              </div>
              <div className="mb-3">
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea rows={3} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <CButton type="submit" color="primary" disabled={saving}>
                {saving ? 'Saving...' : form.id ? 'Update Coupon' : 'Create Coupon'}
              </CButton>
              {form.id ? (
                <CButton type="button" color="secondary" className="ms-2" onClick={() => setForm(emptyForm)}>
                  Cancel
                </CButton>
              ) : null}
            </form>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Coupon List</strong>
            <span className="ms-3">Coupons: {analytics.totalCoupons || 0}</span>
            <span className="ms-3">Redeems: {analytics.totalRedeems || 0}</span>
            <span className="ms-3">Distributed: ₹{Number(analytics.totalRedeemedAmount || 0).toFixed(2)}</span>
          </CCardHeader>
          <CCardBody>
            <CTable responsive striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Usage</CTableHeaderCell>
                  <CTableHeaderCell>Expiry</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {coupons.map((coupon) => (
                  <CTableRow key={coupon._id}>
                    <CTableDataCell>{coupon.code}</CTableDataCell>
                    <CTableDataCell>₹{Number(coupon.rewardAmount || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell className="text-capitalize">{coupon.resolvedStatus || coupon.status}</CTableDataCell>
                    <CTableDataCell>{coupon.usageCount}/{coupon.usageLimit}</CTableDataCell>
                    <CTableDataCell>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleString('en-IN') : '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton size="sm" color="info" className="me-2" onClick={() => handleEdit(coupon)}>Edit</CButton>
                      <CButton size="sm" color="danger" onClick={() => handleDelete(coupon._id)}>Delete</CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader><strong>Redeemed Users</strong></CCardHeader>
          <CCardBody>
            <CTable responsive striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Coupon</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {redeems.map((item) => (
                  <CTableRow key={item._id}>
                    <CTableDataCell>{item.user?.userId}<br /><small>{item.user?.name}</small></CTableDataCell>
                    <CTableDataCell>{item.code || item.coupon?.code}</CTableDataCell>
                    <CTableDataCell>₹{Number(item.amount || 0).toFixed(2)}</CTableDataCell>
                    <CTableDataCell>{new Date(item.redeemedAt).toLocaleString('en-IN')}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CouponManagement
