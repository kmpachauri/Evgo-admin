import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import useAxios from '../hooks/useAxios'
import toast from 'react-hot-toast'

const FIELDS = [
  { key: 'telegram', label: 'Telegram Channel', placeholder: 'https://t.me/yourchannel or @yourchannel' },
  { key: 'whatsapp', label: 'Whatsapp Support', placeholder: 'https://wa.me/919999999999 or 919999999999' },
  { key: 'depositSupport', label: 'Deposit Support (Telegram)', placeholder: 'https://t.me/depositsupport or @depositsupport' },
  { key: 'withdrawalSupport', label: 'Withdrawal Support (Telegram)', placeholder: 'https://t.me/withdrawsupport or @withdrawsupport' },
]

export default function SocialLinks() {
  const { fetchData, loading } = useAxios()
  const [form, setForm] = useState({ telegram: '', whatsapp: '', depositSupport: '', withdrawalSupport: '' })

  useEffect(() => {
    fetchData({ url: '/admin/settings/social', method: 'GET' }).then((res) => {
      if (res?.data) setForm(res.data)
    })
  }, [])

  const handleSave = async () => {
    try {
      await fetchData({ url: '/admin/settings/social', method: 'PUT', data: form })
      toast.success('Social links updated successfully')
    } catch {
      toast.error('Failed to update social links')
    }
  }

  return (
    <CCard>
      <CCardHeader><strong>Social Links Settings</strong></CCardHeader>
      <CCardBody>
        <p className="text-medium-emphasis">
          Full link ya direct WhatsApp number / Telegram handle dono save kar sakte ho.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500 }}>
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key}>
              <CFormLabel>{label}</CFormLabel>
              <CFormInput
                value={form[key] || ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
              />
            </div>
          ))}
          <CButton color="primary" onClick={handleSave} disabled={loading} style={{ width: 120 }}>
            {loading ? <CSpinner size="sm" /> : 'Save'}
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}
