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
  CCol
} from '@coreui/react';
import useAxios from '../../../hooks/useAxios';
import useToastHandler from '../../../hooks/useToastHandler';
import LoadingSpinner from '../../common/LoadinSpinner';

const RaiseTicket = () => {
    const [subject, setSubject] = useState('')
    const [des, setDes] = useState('')
   const { fetchData, loading } = useAxios()
   const { showToast } = useToastHandler()
  const userRaiseTicketSubmit = async (e) => {
    e.preventDefault()
    if (subject ==='' || des === '') {
      showToast('Subject and description are requireddfs','error')
      return
    }
    try {
      const data = await fetchData({
        url: '/api/v1/user/ticket/create-tickets',
        method: 'POST',
        data: { subject:subject,description:des },
      })
      setDes('')
      setSubject('')
      console.log(data)
    } catch (error) {

      console.log(error)
    }
   
  }
  return (
    <>
   {loading && <LoadingSpinner />} {/* Show overlay spinner when loading */}
    <CRow className="justify-content-center mt-4">
      <CCol md={8}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between">
            <strong>Raise Ticket</strong>
            <small className="text-muted">Ticket Status</small>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={userRaiseTicketSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <CFormInput type="text" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <CFormTextarea rows={4} value={des} placeholder="More Tell us About" onChange={(e)=>setDes(e.target.value)}/>
              </div>
              <CButton type='submit' color="dark">Submit</CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
     </>
  );
};

export default RaiseTicket;
