import React, { useEffect, useState } from 'react'
import {
  CAlert,
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
  CFormText,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'

const LotterySettings = () => {
  const { fetchData } = useAxios()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [form, setForm] = useState({ enabled: true, plans: [] })

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await fetchData({ url: '/api/v1/admin/lottery/settings' })
      if (res.success) setForm(res.data)
    } catch (error) {
      setAlert({ color: 'danger', message: error?.message || 'Failed to load lottery settings' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const updatePlan = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      plans: prev.plans.map((plan, i) => (i === index ? { ...plan, [field]: Number(value || 0) } : plan)),
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetchData({
        url: '/api/v1/admin/lottery/settings',
        method: 'PUT',
        data: form,
      })
      if (res.success) setAlert({ color: 'success', message: 'Lottery settings updated successfully.' })
    } catch (error) {
      setAlert({ color: 'danger', message: error?.message || 'Failed to save lottery settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center p-5"><CSpinner color="primary" /></div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader><strong>Lottery Settings</strong></CCardHeader>
          <CCardBody>
            {alert && <CAlert color={alert.color}>{alert.message}</CAlert>}
            <CFormCheck
              className="mb-3"
              label="Enable lottery system"
              checked={Boolean(form.enabled)}
              onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
            <CFormText className="mb-3">
              Direct sponsor gets the lottery chance when their referred user purchases and activates a plan.
              Unclaimed chances expire automatically at 12:00 AM IST.
            </CFormText>

            <CTable responsive striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Plan Price</CTableHeaderCell>
                  <CTableHeaderCell>Fixed Reward</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {form.plans.map((plan, index) => (
                  <CTableRow key={plan.price}>
                    <CTableDataCell>₹ {plan.price}</CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={plan.maxAmount}
                        onChange={(e) => {
                          updatePlan(index, 'minAmount', e.target.value)
                          updatePlan(index, 'maxAmount', e.target.value)
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="mt-3">
              <CButton color="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default LotterySettings
