import { CTable, CTableHead,CTableRow,CTableHeaderCell,CTableDataCell, CTableBody, CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAxios from '../../../../hooks/useAxios'
import useToastHandler from '../../../../hooks/useToastHandler'
import LoadingSpinner from '../../../../components/common/LoadinSpinner'
import { useNavigate } from 'react-router-dom'



function TicketAllStatus() {
    const [allTickets, setAllTickets] = useState([])
    const Navigate = useNavigate()
   const { fetchData, loading } = useAxios()
   const { showToast } = useToastHandler()
  const userRaiseTicketGET= async (e) => {

   
    try {
      const data = await fetchData({
        url: '/api/v1/admin/ticket',
        method: 'GET',
        
      })

      setAllTickets(data?.data)
      
    } catch (error) {

      console.log(error)
    }
   
  }

  useEffect(() => {
    userRaiseTicketGET()
  }, [])
  const statusColorMap = {
  open: "primary",
  in_progress: "warning",
  resolved: "success",
  closed: "danger",
};



function goupdatepage(userdata){
  Navigate(`/admin/all-ticket-status/${userdata?._id}`, {
    state: { userData: userdata }
  });
  // Navigate to the update page with the user data

}
  return (
    <>
    {loading && <LoadingSpinner />} {/* Show overlay spinner when loading */}
    <CTable>
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell scope="col">S.No.</CTableHeaderCell>
      <CTableHeaderCell scope="col">Email</CTableHeaderCell>
      <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
      <CTableHeaderCell scope="col">Create Date</CTableHeaderCell>
      <CTableHeaderCell scope="col">issue</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
   {
    allTickets?.map((x,indx)=>
        (
            <CTableRow color={statusColorMap[x.status] || "info"} key={indx}>
      <CTableHeaderCell scope="row">{indx+1}</CTableHeaderCell>
      <CTableDataCell >{x?.userId?.email}</CTableDataCell>
      <CTableDataCell className="w-25">{x?.subject || ''}</CTableDataCell>
      <CTableDataCell className="w-25">{x?.description || ''}</CTableDataCell>
      <CTableDataCell>{x?.createdAt?.split('T')[0] || x.createdAt}</CTableDataCell>
      <CTableDataCell><CButton color="link" onClick={()=>goupdatepage(x)}>Resolve</CButton></CTableDataCell>
    </CTableRow>
        )
    )
   }
    
  </CTableBody>
</CTable>
    </>
  )
}

export default TicketAllStatus