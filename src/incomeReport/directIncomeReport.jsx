import React, { useEffect, useMemo, useState } from 'react'
import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import useAxios from '../hooks/useAxios'
import LoadingSpinner from '../components/common/LoadinSpinner'
import color from '../views/color'
import Export from '../views/Export'
import apiRoutes from '../variables/apiRoutes'

const incomeTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'plan_daily', label: 'ROI / Daily Income' },
  { value: 'welcome_bonus', label: 'Welcome Bonus' },
  { value: 'invitation_bonus', label: 'Invitation Bonus' },
  { value: 'referral_level_1', label: 'Level 1 Income' },
  { value: 'referral_level_2', label: 'Level 2 Income' },
  { value: 'referral_level_3', label: 'Level 3 Income' },
  { value: 'lottery_reward', label: 'Lottery Reward' },
  { value: 'coupon_reward', label: 'Coupon Reward' },
  { value: 'sign_in_bonus', label: 'Sign-in Bonus' },
]

const labelMap = {
  plan_daily: 'ROI / Daily Income',
  referral_level_1: 'Referral Level 1',
  referral_level_2: 'Referral Level 2',
  referral_level_3: 'Referral Level 3',
  invitation_bonus: 'Invitation Bonus',
  welcome_bonus: 'Welcome Bonus',
  lottery_reward: 'Lottery Reward',
  coupon_reward: 'Coupon Reward',
  sign_in_bonus: 'Sign-in Bonus',
}

function DirectIncomeReport() {
  const { fetchData, loading } = useAxios()
  const [logs, setLogs] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    from: '',
    to: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const loadIncomeLogs = async () => {
      const res = await fetchData({ url: apiRoutes.incomeAnalytics })
      setLogs(res?.data?.recentLogs || [])
    }
    loadIncomeLogs()
  }, [])

  const filtered = useMemo(() => {
    return logs.filter((item) => {
      const searchTerm = filters.search.trim().toLowerCase()
      const itemDate = new Date(item.creditedAt)

      const matchesSearch =
        !searchTerm ||
        item?.user?.userId?.toLowerCase().includes(searchTerm) ||
        item?.user?.name?.toLowerCase().includes(searchTerm) ||
        item?.title?.toLowerCase().includes(searchTerm) ||
        (labelMap[item?.type] || item?.type || '').toLowerCase().includes(searchTerm)

      const matchesType = !filters.type || item.type === filters.type
      const matchesFrom = !filters.from || itemDate >= new Date(filters.from)
      const matchesTo = !filters.to || itemDate <= new Date(`${filters.to}T23:59:59`)

      return matchesSearch && matchesType && matchesFrom && matchesTo
    })
  }, [logs, filters])

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const handleReset = () => {
    setFilters({ search: '', type: '', from: '', to: '' })
    setCurrentPage(1)
  }

  const exportRows = filtered.map((item) => ({
    userId: item?.user?.userId || 'N/A',
    name: item?.user?.name || 'N/A',
    type: labelMap[item?.type] || item?.type || 'N/A',
    amount: Number(item?.amount || 0).toFixed(2),
    title: item?.title || 'N/A',
    sourceUser: item?.sourceUser?.userId || item?.meta?.sourceUserId || '-',
    date: item?.creditedAt ? new Date(item.creditedAt).toLocaleString('en-IN') : 'N/A',
  }))

  const fields = [
    { key: 'userId', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Income Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'title', label: 'Title' },
    { key: 'sourceUser', label: 'Source User' },
    { key: 'date', label: 'Date' },
  ]

  return (
    <>
      {loading && <LoadingSpinner />}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="Search"
            placeholder="User ID, name, title"
            value={filters.search}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, search: e.target.value }))
              setCurrentPage(1)
            }}
          />
        </CCol>
        <CCol md={3}>
          <CFormSelect
            label="Income Type"
            value={filters.type}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, type: e.target.value }))
              setCurrentPage(1)
            }}
            options={incomeTypeOptions}
          />
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="date"
            label="From Date"
            value={filters.from}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, from: e.target.value }))
              setCurrentPage(1)
            }}
          />
        </CCol>
        <CCol md={2}>
          <CFormInput
            type="date"
            label="To Date"
            value={filters.to}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, to: e.target.value }))
              setCurrentPage(1)
            }}
          />
        </CCol>
        <CCol md={2} className="d-flex align-items-end gap-2">
          <CButton
            color="primary"
            style={{
              background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
              color: 'white',
            }}
          >
            Filtered
          </CButton>
          <CButton color="secondary" onClick={handleReset}>
            Reset
          </CButton>
          <Export userdata={exportRows} fields={fields} />
        </CCol>
      </CRow>

      <div className="table-responsive">
        <CTable hover bordered className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>User</CTableHeaderCell>
              <CTableHeaderCell>Income Type</CTableHeaderCell>
              <CTableHeaderCell>Amount</CTableHeaderCell>
              <CTableHeaderCell>Title</CTableHeaderCell>
              <CTableHeaderCell>Source</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.length ? (
              currentItems.map((item, index) => (
                <CTableRow key={item._id || index}>
                  <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                  <CTableDataCell>
                    {item?.user?.userId || 'N/A'}
                    <div className="small text-muted">{item?.user?.name || '-'}</div>
                  </CTableDataCell>
                  <CTableDataCell>{labelMap[item?.type] || item?.type || 'N/A'}</CTableDataCell>
                  <CTableDataCell>₹{Number(item?.amount || 0).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>{item?.title || 'N/A'}</CTableDataCell>
                  <CTableDataCell>
                    {item?.sourceUser?.userId || item?.meta?.sourceUserId || '-'}
                    <div className="small text-muted">{item?.sourceUser?.name || item?.meta?.couponCode || '-'}</div>
                  </CTableDataCell>
                  <CTableDataCell>{item?.creditedAt ? new Date(item.creditedAt).toLocaleString('en-IN') : 'N/A'}</CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="7" className="text-center text-muted">
                  No income records found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {filtered.length ? indexOfFirst + 1 : 0} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <CButton
              key={i}
              size="sm"
              color={i + 1 === currentPage ? 'dark' : 'light'}
              className="me-1"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </CButton>
          ))}
        </div>
      </div>
    </>
  )
}

export default DirectIncomeReport
