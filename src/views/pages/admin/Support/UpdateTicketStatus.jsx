// TicketForm.js (React with CoreUI)
import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CFormSelect,
  CToast,
  CToastBody,
  CToastClose
} from '@coreui/react';
import useAxios from '../../../../hooks/useAxios';
import useToastHandler from '../../../../hooks/useToastHandler';
import LoadingSpinner from '../../../../components/common/LoadinSpinner';
import { useLocation } from 'react-router-dom';
import CIcon from '@coreui/icons-react';


const UpdateTicketStatus = () => {
   const location = useLocation();

  const userData = location.state?.userData;
  console.log(userData)
    const [adminMSG, setadminMSG] = useState('')
    const [subject, setSubject] = useState(userData?.subject)
    const [des, setDes] = useState(userData?.description)
    const [Status, setStatus] = useState('')
   const { fetchData, loading } = useAxios()
   const { showToast } = useToastHandler()
  const userRaiseTicketSubmit = async (e) => {
    e.preventDefault()
    // if (subject ==='' || des === '') {
    //   showToast('Subject and description are requireddfs','error')
    //   return
    // }
    try {
      const data = await fetchData({
        url: `/api/v1/admin/ticket/update/${userData?._id}`,
        method: 'PATCH',
        data: {  status: Status,
  response: {
    message: adminMSG
  } },
      })
      setadminMSG('')
      setStatus('')
      console.log(data)
    } catch (error) {

      console.log(error)
    }
   
  }
  return (
    <>
   {loading && <LoadingSpinner />} {/* Show overlay spinner when loading */}
    <CRow className="justify-content-center mt-4">
      <CCol md={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between">
            <strong>Update Ticket Status</strong>
            <small className="text-muted">{userData?.status}</small>
          </CCardHeader>
          <div className="mb-3">
                <h5 className="ms-2 fw-semibold">Admin Response</h5>
               <div className="d-grid pr-2 gap-2 col-12 d-md-flex justify-content-md-end mt-2 flex-wrap">
          {
              userData?.responses?.map((x,indx)=>
                ( 
                  <CButton color="secondary" className='col-11 ' variant="outline">✔{x.message}</CButton>
                )
              )
            }
            </div>
              </div>
          
          <CCardBody>
            <CForm onSubmit={userRaiseTicketSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <CFormTextarea disabled type="text" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <CFormTextarea disabled rows={4} value={des} placeholder="More Tell us About" onChange={(e)=>setDes(e.target.value)}/>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Send Query Message</label>
                <CFormTextarea  rows={4} value={adminMSG} placeholder="Send resolve and query...." onChange={(e)=>setadminMSG(e.target.value)}/>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Status</label>
                 <CFormSelect
                 onChange={(e)=>setStatus(e.target.value)}
      aria-label="Default select status"
      options={[
        'Open this select status',
        { label: 'open', value: 'open' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Close', value: 'closed' },
        
      ]}
    />
              </div>
              <CButton type='submit' color="dark">Update</CButton>
            </CForm>
            
            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
     </>
  );
};

export default UpdateTicketStatus;
