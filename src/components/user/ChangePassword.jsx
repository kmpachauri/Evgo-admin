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
  CRow,
} from '@coreui/react'
import Swal from 'sweetalert2'
import useAxios from '../../hooks/useAxios'
import useAuth from '../../hooks/useAuth'

const ChangePassword = () => {
  const { fetchData, loading } = useAxios()
  const { logout } = useAuth()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All password fields are required.')
      return
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    try {
      await fetchData({
        url: '/api/v1/auth/change-password',
        method: 'POST',
        data: {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
      })

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      await Swal.fire({
        icon: 'success',
        title: 'Password changed',
        text: 'Please login again with your new password.',
        confirmButtonText: 'OK',
      })

      logout()
    } catch (_error) {
      // Error toast already handled in useAxios.
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={8} lg={6}>
        <CCard>
          <CCardHeader>
            <h5 className="mb-0">Change Password</h5>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis">
              Update your admin password here. You will be asked to login again after saving it.
            </p>

            {error ? <CAlert color="danger">{error}</CAlert> : null}

            <CForm onSubmit={handleSubmit}>
              <CFormInput
                type="password"
                label="Current Password"
                className="mb-3"
                value={form.currentPassword}
                onChange={(event) => handleChange('currentPassword', event.target.value)}
                autoComplete="current-password"
              />
              <CFormInput
                type="password"
                label="New Password"
                className="mb-3"
                value={form.newPassword}
                onChange={(event) => handleChange('newPassword', event.target.value)}
                autoComplete="new-password"
              />
              <CFormInput
                type="password"
                label="Confirm Password"
                className="mb-4"
                value={form.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
                autoComplete="new-password"
              />

              <CButton type="submit" color="primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ChangePassword
