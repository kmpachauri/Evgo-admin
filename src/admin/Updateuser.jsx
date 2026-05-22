import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
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
  const [rechargeLoading, setRechargeLoading] = useState(false)
  const [deductLoading, setDeductLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [rechargeForm, setRechargeForm] = useState({
    planId: '',
    amount: '',
    remark: '',
  })
  const [deductForm, setDeductForm] = useState({
    amount: '',
    remark: '',
  })

  const hydrateUserForm = (sourceUser) => {
    if (!sourceUser) return

    setForm({
      sponsor: sourceUser.sponsorUserId || sourceUser.sponsor || '',
      userId: sourceUser.userId || '',
      name: sourceUser.name || '',
      phone: sourceUser.phone || '',
      walletBalance: sourceUser.walletBalance || 0,
      password: '',
      isActivated: Boolean(sourceUser.isActivated),
      totalInvested: sourceUser.totalAssets || sourceUser.totalInvested || 0,
    })
  }

  const loadDetail = async () => {
    try {
      const res = await fetchData({ url: apiRoutes.userDetail(userId) })
      const data = res?.data || null
      setDetail(data)
      hydrateUserForm(data?.user || fallbackUser)
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch user detail')
    }
  }

  const loadPlans = async () => {
    try {
      const res = await fetchData({ url: apiRoutes.plans, method: 'GET' })
      const rows = Array.isArray(res?.data) ? res.data : []
      setPlans(
        rows.filter((item) =>
          String(item?.name || item?.code || '').trim().toLowerCase().startsWith('evgo'),
        ),
      )
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch plans')
    }
  }

  useEffect(() => {
    loadDetail()
    loadPlans()
  }, [userId])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleRechargeFieldChange = (key, value) => {
    if (key === 'planId') {
      const chosenPlan = plans.find((item) => item._id === value)
      setRechargeForm((prev) => ({
        ...prev,
        planId: value,
        amount: chosenPlan ? String(chosenPlan.price) : '',
      }))
      return
    }

    setRechargeForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    const payload = {
      sponsor: form.sponsor,
      userId: form.userId,
      name: form.name,
      phone: form.phone,
      password: form.password,
      isActivated: form.isActivated,
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
        await loadDetail()
      }
    } catch (error) {
      toast.error(error?.message || 'Error while updating user')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    hydrateUserForm(detail?.user || fallbackUser)
  }

  const handleAddRecharge = async () => {
    const numericAmount = Number(rechargeForm.amount || 0)
    if (numericAmount <= 0) {
      toast.error('Please enter a valid recharge amount')
      return
    }

    setRechargeLoading(true)
    try {
      const res = await fetchData({
        url: apiRoutes.addUserRecharge(userId),
        method: 'POST',
        data: {
          planId: rechargeForm.planId || null,
          amount: numericAmount,
          remark: rechargeForm.remark,
        },
      })

      if (res?.success) {
        toast.success('Recharge added successfully')
        setRechargeForm({ planId: '', amount: '', remark: '' })
        await loadDetail()
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to add recharge')
    } finally {
      setRechargeLoading(false)
    }
  }

  const handleDeductWallet = async () => {
    const numericAmount = Number(deductForm.amount || 0)
    if (numericAmount <= 0) {
      toast.error('Please enter a valid deduction amount')
      return
    }

    setDeductLoading(true)
    try {
      const res = await fetchData({
        url: apiRoutes.deductUserWallet(userId),
        method: 'POST',
        data: {
          amount: numericAmount,
          remark: deductForm.remark,
        },
      })

      if (res?.success) {
        toast.success('Wallet amount deducted successfully')
        setDeductForm({ amount: '', remark: '' })
        await loadDetail()
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to deduct wallet balance')
    } finally {
      setDeductLoading(false)
    }
  }

  const user = detail?.user || fallbackUser
  const isManualAdminDeduct = (item) =>
    String(item?.remark || '').toLowerCase().includes('manual deduct by admin')

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
                  disabled
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

            <hr />

            <CRow className="g-3">
              <CCol xs={12}>
                <strong>Add Recharge / Plan</strong>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  label="Select Plan"
                  value={rechargeForm.planId}
                  onChange={(e) => handleRechargeFieldChange('planId', e.target.value)}
                >
                  <option value="">Wallet Credit Only</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - Rs {Number(plan.price || 0).toFixed(2)}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Recharge Amount"
                  type="number"
                  value={rechargeForm.amount}
                  onChange={(e) => handleRechargeFieldChange('amount', e.target.value)}
                  placeholder="Enter recharge amount"
                />
              </CCol>
              <CCol xs={12}>
                <CFormInput
                  label="Recharge Remark"
                  value={rechargeForm.remark}
                  onChange={(e) => handleRechargeFieldChange('remark', e.target.value)}
                  placeholder="Optional admin remark"
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="success" type="button" onClick={handleAddRecharge} disabled={rechargeLoading}>
                  {rechargeLoading ? 'Processing...' : 'Add Recharge'}
                </CButton>
              </CCol>
            </CRow>

            <hr />

            <CRow className="g-3">
              <CCol xs={12}>
                <strong>Deduct Wallet Amount</strong>
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Deduct Amount"
                  type="number"
                  value={deductForm.amount}
                  onChange={(e) => setDeductForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount to deduct"
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  label="Deduct Remark"
                  value={deductForm.remark}
                  onChange={(e) => setDeductForm((prev) => ({ ...prev, remark: e.target.value }))}
                  placeholder="Optional deduction reason"
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="danger" type="button" onClick={handleDeductWallet} disabled={deductLoading}>
                  {deductLoading ? 'Processing...' : 'Deduct Amount'}
                </CButton>
              </CCol>
            </CRow>
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
                        <CTableDataCell>₹{Number(item.purchaseAmount || 0).toFixed(2)}</CTableDataCell>
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
                            {item.utrNumber
                              ? 'Recharge'
                              : isManualAdminDeduct(item)
                                ? 'Manual Deduct'
                                : 'Withdrawal'}
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

          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Recent Income History</strong>
              </CCardHeader>
              <CCardBody>
                <CTable responsive striped>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Amount</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {(detail?.incomes || []).slice(0, 8).map((item) => (
                      <CTableRow key={item._id}>
                        <CTableDataCell>{item.title || '-'}</CTableDataCell>
                        <CTableDataCell className="text-capitalize">
                          {String(item.type || '').replaceAll('_', ' ')}
                        </CTableDataCell>
                        <CTableDataCell>₹{Number(item.amount || 0).toFixed(2)}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(item.creditedAt || item.createdAt).toLocaleString('en-IN')}
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
