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
  CFormSelect
} from '@coreui/react';
import useAxios from '../../../hooks/useAxios';
import useToastHandler from '../../../hooks/useToastHandler';
import LoadingSpinner from '../../common/LoadinSpinner';

const PlanActivation = () => {
  const [subject, setSubject] = useState('')
  const [planAmount, setPlanamount] = useState(0)
  const [userID, setUserId] = useState('NIK3005')
  const [des, setDes] = useState('')
  const { fetchData, loading } = useAxios()
  const { showToast } = useToastHandler()

  function ChoosePlan(e) {
    const selectedPlan = e.target.value;
    console.log(selectedPlan);
    if (selectedPlan === 'planA') {
      setSubject('A');
      setPlanamount(1500); // Example amount for BASIC plan
    } else if (selectedPlan === 'planB') {
      setSubject('B');
      setPlanamount(2000); // Example amount for STANDARD plan
    } else {
      setSubject('');
      setPlanamount(0)
    }
  }



  const userRaiseTicketSubmit = async (e) => {
    e.preventDefault()
    if (planAmount === 0) {
      showToast('Choose first any Plan', 'error')
      return
    }
    try {
      const data = await fetchData({
        url: '/api/v1/user/profile/activate-account',
        method: 'POST',
        data: { plan: subject },
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
              <strong>User Activation</strong>
              <small className="text-muted">User Activation</small>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={userRaiseTicketSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Investment Portfolio(Plan)</label>
                  <CFormSelect size="sm" className="mb-3" aria-label="Small select example" required onChange={(e) => ChoosePlan(e)}>
                    <option>Select Investment Plan</option>
                    <option value="planA">BASIC</option>
                    <option value="planB">STANDARD</option>


                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Invest Fund Amount</label>
                  <CFormInput type="text" placeholder="plan Amount" value={planAmount} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Activate UserId</label>
                  <CFormInput rows={4} value={userID} placeholder="Activate UserId" />
                </div>
                <CButton type='submit' color="dark">Activate</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};




export default PlanActivation