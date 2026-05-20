import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSwitch,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios from '../hooks/useAxios'
import apiRoutes from '../variables/apiRoutes'

const emptyForm = {
  sponsor: '',
  userId: '',
  name: '',
  phone: '',
  email: '',
  walletBalance: 0,
  password: '',
  isActivated: false,
  totalInvested: 0,
}

export default function Updateuser() {
  const { userId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchData, loading } = useAxios()
  const fallbackUser = location.state?.user || null

  const [form, setForm] = useState(emptyForm)
  const [detail, setDetail] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetchData({ url: apiRoutes.userDetail(userId) })
        const data = res?.data || null
        setDetail(data)
        const sourceUser = data?.user || fallbackUser
        if (sourceUser) {
          setForm({
            sponsor: sourceUser.sponsorUserId || sourceUser.sponsor || '',
            userId: sourceUser.userId || '',
            name: sourceUser.name || '',
            phone: sourceUser.phone || '',
            email: sourceUser.email || '',
            walletBalance: sourceUser.walletBalance || 0,
            password: '',
            isActivated: Boolean(sourceUser.isActivated),
            totalInvested: sourceUser.totalAssets || sourceUser.totalInvested || 0,
          })
        }
      } catch (error) {
        toast.error(error?.message || 'Failed to fetch user detail')
      }
    }

    loadDetail()
  }, [userId])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      walletBalance: Number(form.walletBalance || 0),
      totalInvested: Number(form.totalInvested || 0),
    }

    setSaving(true)
    try {
      const res = await fetchData({
        url: `/api/v1/admin/user/update-a-user/${userId}`,
        method: 'PUT',
        data: payload,
      })

      if (res.success) {
        toast.success('User updated successfully')
      }
    } catch (error) {
      toast.error(error?.message || 'Error while updating user')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    const sourceUser = detail?.user || fallbackUser
    if (!sourceUser) return

    setForm({
      sponsor: sourceUser.sponsorUserId || sourceUser.sponsor || '',
      userId: sourceUser.userId || '',
      name: sourceUser.name || '',
      phone: sourceUser.phone || '',
      email: sourceUser.email || '',
      walletBalance: sourceUser.walletBalance || 0,
      password: '',
      isActivated: Boolean(sourceUser.isActivated),
      totalInvested: sourceUser.totalAssets || sourceUser.totalInvested || 0,
    })
  }

  const user = detail?.user || fallbackUser

  return (
    <CRow>
      <CCol lg={5}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>User Management</strong>
          </CCardHeader>
          <CCardBody>
            {loading && !user ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
              </div>
            ) : null}

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput label="Sponsor ID" value={form.sponsor} disabled />
              </CCol>
              <CCol md={6}>
                <CFormInput label="User ID" value={form.userId} disabled />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Mobile"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={12}>
                <CFormInput
                  label="Email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormInput
                  label="Wallet Balance"
                  type="number"
                  value={form.walletBalance}
                  onChange={(e) => handleChange('walletBalance', e.target.value)}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Total Invested"
                  type="number"
                  value={form.totalInvested}
                  onChange={(e) => handleChange('totalInvested', e.target.value)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <CFormInput
                  label="Reset Password"
                  type="password"
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </CCol>
              <CCol md={6} className="d-flex flex-column justify-content-center">
                <label className="fw-bold mb-2">Activation Status</label>
                <CFormSwitch
                  label={form.isActivated ? 'Activated' : 'Deactivated'}
                  checked={Boolean(form.isActivated)}
                  onChange={(e) => handleChange('isActivated', e.target.checked)}
                />
              </CCol>
            </CRow>

            <div className="d-flex gap-2">
              <CButton color="primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : 'Update User'}
              </CButton>
              <CButton color="secondary" onClick={handleReset}>
                Reset
              </CButton>
              <CButton color="light" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol lg={7}>
        <CRow>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Wallet Snapshot</strong>
              </CCardHeader>
              <CCardBody>
                <div className="mb-2">
                  Current Balance: ₹{Number(user?.walletBalance || 0).toFixed(2)}
                </div>
                <div className="mb-2">
                  Total Income: ₹{Number(user?.totalIncome || 0).toFixed(2)}
                </div>
                <div className="mb-2">
                  Today Income: ₹{Number(user?.todayIncome || 0).toFixed(2)}
                </div>
                <div className="mb-2">
                  Total Recharge: ₹{Number(user?.totalRecharge || 0).toFixed(2)}
                </div>
                <div>Total Withdraw: ₹{Number(user?.totalWithdraw || 0).toFixed(2)}</div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={6}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Team Snapshot</strong>
              </CCardHeader>
              <CCardBody>
                <div className="mb-2">
                  Direct Referrals: {detail?.team?.totalDirectReferrals || 0}
                </div>
                <div className="mb-2">
                  Active Direct Referrals: {detail?.team?.activeDirectReferrals || 0}
                </div>
                <div className="mb-2">Account Status: {user?.status || 'N/A'}</div>
                <div>Activated: {user?.isActivated ? 'Yes' : 'No'}</div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Plan History</strong>
              </CCardHeader>
              <CCardBody>
                <CTable responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Plan</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Activated</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(detail?.plans || []).slice(0, 5).map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{item.planName}</CTableDataCell>
                        <CTableDataCell>
                          ₹{Number(item.purchaseAmount || 0).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell className="text-capitalize">{item.status}</CTableDataCell>
                        <CTableDataCell>
                          {item.activatedAt
                            ? new Date(item.activatedAt).toLocaleDateString('en-IN')
                            : '-'}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Recent Transactions</strong>
              </CCardHeader>
              <CCardBody>
                <CTable responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {[...(detail?.recharges || []), ...(detail?.withdrawals || [])]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 8)
                      .map((item) => (
                        <CTableRow key={item._id}>
                          <CTableDataCell>
                            {item.utrNumber ? 'Recharge' : 'Withdrawal'}
                          </CTableDataCell>
                          <CTableDataCell>₹{Number(item.amount || 0).toFixed(2)}</CTableDataCell>
                          <CTableDataCell className="text-capitalize">{item.status}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(item.createdAt).toLocaleString('en-IN')}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}
