import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'
import apiRoutes from '../../variables/apiRoutes'

export default function SystemSettings() {
  const { fetchData, loading } = useAxios()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData({ url: apiRoutes.systemSettings })
      setForm(res?.data || null)
    }
    loadData()
  }, [])

  const updateSection = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetchData({
        url: apiRoutes.systemSettings,
        method: 'PUT',
        data: form,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading && !form) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol lg={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Banner & Notification</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormTextarea
                rows={4}
                label="Banner Message"
                value={form?.banner?.message || ''}
                onChange={(e) => updateSection('banner', 'message', e.target.value)}
              />
            </div>
            <div className="mb-3">
              <CFormCheck
                label="Banner Active"
                checked={Boolean(form?.banner?.isActive)}
                onChange={(e) => updateSection('banner', 'isActive', e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <CFormCheck
                label="Push Notifications Enabled"
                checked={Boolean(form?.notification?.pushEnabled)}
                onChange={(e) => updateSection('notification', 'pushEnabled', e.target.checked)}
              />
            </div>
            <div className="mb-3">
              <CFormCheck
                label="In-app Notifications Enabled"
                checked={Boolean(form?.notification?.inAppEnabled)}
                onChange={(e) => updateSection('notification', 'inAppEnabled', e.target.checked)}
              />
            </div>
            <div className="small text-muted">
              Payment method aur withdrawal rule ab fixed hain. UPI aur scanner image ke liye `Payment Settings` page use karein.
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CButton color="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </CButton>
      </CCol>
    </CRow>
  )
}
