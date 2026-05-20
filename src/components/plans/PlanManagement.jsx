import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
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
import apiRoutes from '../../variables/apiRoutes'

const emptyForm = {
  _id: '',
  code: '',
  name: '',
  price: '',
  dailyIncome: '',
  durationDays: '',
  totalRevenue: '',
  invitationBonus: '',
  welcomeBonus: '',
  purchaseLimit: '',
  isActive: true,
}

const numberFields = [
  'price',
  'dailyIncome',
  'durationDays',
  'totalRevenue',
  'invitationBonus',
  'welcomeBonus',
  'purchaseLimit',
]

export default function PlanManagement() {
  const { fetchData, loading } = useAxios()
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const loadPlans = async () => {
    const res = await fetchData({ url: apiRoutes.plans })
    setPlans(res?.data || [])
  }

  useEffect(() => {
    loadPlans()
  }, [])

  const handleEdit = (plan) => {
    setForm({
      ...plan,
      price: String(plan.price ?? ''),
      dailyIncome: String(plan.dailyIncome ?? ''),
      durationDays: String(plan.durationDays ?? ''),
      totalRevenue: String(plan.totalRevenue ?? ''),
      invitationBonus: String(plan.invitationBonus ?? ''),
      welcomeBonus: String(plan.welcomeBonus ?? ''),
      purchaseLimit: String(plan.purchaseLimit ?? ''),
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form._id) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        isActive: Boolean(form.isActive),
      }
      for (const field of numberFields) {
        payload[field] = Number(form[field] || 0)
      }

      await fetchData({
        url: apiRoutes.planById(form._id),
        method: 'PUT',
        data: payload,
      })
      await loadPlans()
    } finally {
      setSaving(false)
    }
  }

  return (
    <CRow>
      <CCol lg={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Plan Management</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CTable responsive striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Plan</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Daily</CTableHeaderCell>
                    <CTableHeaderCell>Days</CTableHeaderCell>
                    <CTableHeaderCell>Bonus</CTableHeaderCell>
                    <CTableHeaderCell>Limit</CTableHeaderCell>
                    <CTableHeaderCell>Analytics</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {plans.map((plan) => (
                    <CTableRow key={plan._id}>
                      <CTableDataCell>
                        <strong>{plan.name}</strong>
                        <div className="small text-muted">{plan.code}</div>
                      </CTableDataCell>
                      <CTableDataCell>₹{Number(plan.price || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>₹{Number(plan.dailyIncome || 0).toFixed(2)}</CTableDataCell>
                      <CTableDataCell>{plan.durationDays}</CTableDataCell>
                      <CTableDataCell>
                        Invite ₹{plan.invitationBonus}
                        <div className="small text-muted">Welcome ₹{plan.welcomeBonus}</div>
                      </CTableDataCell>
                      <CTableDataCell>{plan.purchaseLimit}</CTableDataCell>
                      <CTableDataCell>
                        Purchases {plan.totalPurchases || 0}
                        <div className="small text-muted">
                          Invested ₹{Number(plan.investedAmount || 0).toFixed(2)}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton size="sm" color="info" onClick={() => handleEdit(plan)}>
                          Edit
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{form._id ? 'Edit Plan' : 'Select a Plan'}</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <CFormInput label="Code" value={form.code} disabled />
              </div>
              <div className="mb-3">
                <CFormInput
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              {numberFields.map((field) => (
                <div className="mb-3" key={field}>
                  <CFormInput
                    label={field}
                    type="number"
                    value={form[field]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="mb-3">
                <CFormCheck
                  label="Plan active"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
              </div>
              <CButton type="submit" color="primary" disabled={!form._id || saving}>
                {saving ? 'Saving...' : 'Save Plan'}
              </CButton>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
