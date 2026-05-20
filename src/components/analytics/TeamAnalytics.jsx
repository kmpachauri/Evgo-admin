import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import useAxios from '../../hooks/useAxios'
import apiRoutes from '../../variables/apiRoutes'

export default function TeamAnalytics() {
  const { fetchData, loading } = useAxios()
  const [data, setData] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData({ url: apiRoutes.teamAnalytics })
      setData(res?.data || null)
    }
    loadData()
  }, [])

  if (loading && !data) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  const levelLabels = data?.levels?.map((item) => `Level ${item.level}`) || []
  const levelCounts = data?.levels?.map((item) => item.count) || []

  return (
    <CRow>
      <CCol lg={4}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Team Snapshot</strong>
          </CCardHeader>
          <CCardBody>
            <div className="mb-3">
              Total Members: <strong>{data?.totalMembers || 0}</strong>
            </div>
            <div className="mb-3">
              Active Members: <strong>{data?.activeMembers || 0}</strong>
            </div>
            <div className="mb-3">
              Inactive Members: <strong>{data?.inactiveMembers || 0}</strong>
            </div>
            <div>
              Total Team Income: <strong>₹{Number(data?.totalTeamIncome || 0).toFixed(2)}</strong>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Level-wise Team Distribution</strong>
          </CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: levelLabels,
                datasets: [
                  {
                    label: 'Members',
                    data: levelCounts,
                    backgroundColor: ['#0f766e', '#0b5ed7', '#2563eb', '#1d4ed8'],
                    borderRadius: 10,
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Level Summary</strong>
          </CCardHeader>
          <CCardBody>
            <CTable responsive striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Level</CTableHeaderCell>
                  <CTableHeaderCell>Member Count</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {(data?.levels || []).map((item) => (
                  <CTableRow key={item.level}>
                    <CTableDataCell>Level {item.level}</CTableDataCell>
                    <CTableDataCell>{item.count}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
