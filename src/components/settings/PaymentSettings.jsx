import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'
import apiRoutes from '../../variables/apiRoutes'

const defaultForm = {
  payment: {
    upiId: '',
    qrCodeImage: '',
  },
}

export default function PaymentSettings() {
  const { fetchData, loading } = useAxios()
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [qrPreview, setQrPreview] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData({ url: apiRoutes.systemSettings })
      const data = res?.data || {}

      setForm({
        payment: {
          upiId: data?.payment?.upiId || '',
          qrCodeImage: data?.payment?.qrCodeImage || '',
        },
      })
      setQrPreview(data?.payment?.qrCodeImage || '')
    }

    loadData()
  }, [])

  const updateSection = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const imageData = typeof reader.result === 'string' ? reader.result : ''
      updateSection('payment', 'qrCodeImage', imageData)
      setQrPreview(imageData)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetchData({
        url: apiRoutes.systemSettings,
        method: 'PUT',
        data: { payment: form.payment },
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading && !form?.payment) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol lg={7}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Payment Method Setup</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              <CFormInput
                label="UPI ID"
                placeholder="example@upi"
                value={form.payment.upiId}
                onChange={(e) => updateSection('payment', 'upiId', e.target.value)}
              />
            </div>

            <div className="mb-3">
              <CFormLabel>Upload QR Scanner Image</CFormLabel>
              <CFormInput type="file" accept="image/*" onChange={handleQrUpload} />
              <div className="small text-muted mt-2">
                File upload image ko settings me save karega. Zarurat ho to aap direct image URL bhi paste kar sakte hain.
              </div>
            </div>

            <div className="mb-3">
              <CFormTextarea
                rows={3}
                label="QR Image URL / Base64"
                value={form.payment.qrCodeImage}
                onChange={(e) => {
                  updateSection('payment', 'qrCodeImage', e.target.value)
                  setQrPreview(e.target.value)
                }}
              />
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={5}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Scanner Preview</strong>
          </CCardHeader>
          <CCardBody className="text-center">
            {qrPreview ? (
              <img
                src={qrPreview}
                alt="UPI QR Preview"
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }}
              />
            ) : (
              <div className="text-muted py-5">No scanner image added yet.</div>
            )}
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader>
            <strong>Current Method Summary</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-2"><strong>UPI:</strong> {form.payment.upiId || 'Not set'}</div>
            <div className="mb-2"><strong>Scanner:</strong> {qrPreview ? 'Uploaded' : 'Not uploaded'}</div>
            <div className="small text-muted mt-3">
              Mobile app automatically `/user/payment-info` endpoint se yehi UPI ID aur QR scanner image show karega.
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Payment Settings'}
        </CButton>
      </CCol>
    </CRow>
  )
}
