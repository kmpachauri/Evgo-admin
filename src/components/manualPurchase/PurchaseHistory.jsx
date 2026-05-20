import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilSearch } from '@coreui/icons'
import useAxios from '../../hooks/useAxios'

const PurchaseHistory = () => {
  const { fetchData } = useAxios()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })
  const [filters, setFilters] = useState({ from: '', to: '', userId: '' })

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const fetchBills = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)
      if (filters.userId) params.append('userId', filters.userId)

      const res = await fetchData({ url: `/api/v1/admin/purchase-bills?${params}` })
      if (res.success) setBills(res.data.bills || [])
    } catch (error) {
      showAlert(error?.message || 'Failed to load purchase bills', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0)
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString('en-IN') : '-')

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" />
        <p className="mt-2">Loading purchase bills...</p>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Purchase Bill History</strong>
          </CCardHeader>
          <CCardBody>
            {alert.show && <CAlert color={alert.color}>{alert.message}</CAlert>}

            <CRow className="mb-3">
              <CCol md={3}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  <CFormInput type="date" name="from" value={filters.from} onChange={handleFilterChange} />
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                  <CFormInput type="date" name="to" value={filters.to} onChange={handleFilterChange} />
                </CInputGroup>
              </CCol>
              <CCol md={4}>
                <CInputGroup>
                  <CInputGroupText><CIcon icon={cilSearch} /></CInputGroupText>
                  <CFormInput name="userId" value={filters.userId} onChange={handleFilterChange} placeholder="User ID" />
                </CInputGroup>
              </CCol>
              <CCol md={2}>
                <CButton color="primary" onClick={fetchBills}>Search</CButton>
              </CCol>
            </CRow>

            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>User</CTableHeaderCell>
                  <CTableHeaderCell>Bill No.</CTableHeaderCell>
                  <CTableHeaderCell>Product</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Direct 5%</CTableHeaderCell>
                  <CTableHeaderCell>Team Pool 10%</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {bills.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center">No bills found</CTableDataCell>
                  </CTableRow>
                ) : (
                  bills.map((bill, index) => (
                    <CTableRow key={bill._id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{formatDate(bill.billDate || bill.createdAt)}</CTableDataCell>
                      <CTableDataCell>{bill.userId}<br /><small>{bill.user?.name}</small></CTableDataCell>
                      <CTableDataCell>{bill.billNumber || '-'}</CTableDataCell>
                      <CTableDataCell>{bill.productName}<br /><small>{bill.designName || bill.materialType || ''}</small></CTableDataCell>
                      <CTableDataCell>{formatCurrency(bill.amount)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(bill.directIncomeAmount)}</CTableDataCell>
                      <CTableDataCell>{formatCurrency(bill.binaryPoolAmount)}</CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PurchaseHistory
