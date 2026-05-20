import { CTable, CTableHead,CTableRow,CTableHeaderCell,CTableDataCell, CTableBody, CPopover, CButton } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import useAxios from '../../../hooks/useAxios'
import useToastHandler from '../../../hooks/useToastHandler'
import LoadingSpinner from '../../common/LoadinSpinner'

function TicketStatus() {
    const [allTickets, setAllTickets] = useState([])
    
   const { fetchData, loading } = useAxios()
   const { showToast } = useToastHandler()
  const userRaiseTicketGET= async (e) => {

   
    try {
      const data = await fetchData({
        url: '/api/v1/user/ticket/my-tickets',
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
  return (
    <>
    {loading && <LoadingSpinner />} {/* Show overlay spinner when loading */}
    <CTable>
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell scope="col">S.No.</CTableHeaderCell>
      <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
      <CTableHeaderCell scope="col">Response</CTableHeaderCell>
      <CTableHeaderCell scope="col">Create Date</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
   {allTickets?.length ? (
    allTickets?.map((x,indx)=>
        (
            <CTableRow color={statusColorMap[x.status] || "info"} key={indx}>
      <CTableHeaderCell scope="row">{indx+1}</CTableHeaderCell>
      <CTableDataCell className="w-25">{x?.subject || ''}</CTableDataCell>
      <CTableDataCell className="w-25">{x?.description || ''}</CTableDataCell>
      <CTableDataCell className='w-25'>
        <div className=' gap-1 d-flex'>
            {x?.responses?.map((x,indx)=>
                ( 
                    <CPopover
                    className=''
                  title={`Admin Response ${indx+1}`}
                  content={x.message}
                  placement="bottom"
                >
                    <CButton color="dark" variant="outline" size="md">
                 {indx+1}
      </CButton>
    </CPopover>
                )
              )}

        </div>
        
      </CTableDataCell>
      <CTableDataCell>{x?.createdAt?.split('T')[0] || x.createdAt}</CTableDataCell>
    </CTableRow>
        )
    ))
    :
     <CTableRow color="info" >
      <CTableHeaderCell scope="row" colSpan="4" className='text-center'>No data Found</CTableHeaderCell>
      
    </CTableRow>
   }
    
  </CTableBody>
</CTable>
    </>
  )
}

export default TicketStatus