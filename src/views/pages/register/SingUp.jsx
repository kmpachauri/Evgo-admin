import React, { useState } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CCol,
  CFormLabel
} from '@coreui/react';
// import './Signup.css';

const SignupPage = () => {
  const [activeTab, setActiveTab] = useState('signup');

  return (
    <div className="signup-bg">
      <CContainer className="d-flex justify-content-center align-items-center min-vh-100">
        <CCard className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === 'login'}
                onClick={() => setActiveTab('login')}
              >
                Login
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'signup'}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </CNavLink>
            </CNavItem>
          </CNav>

          <CCardBody>
            {activeTab === 'signup' && (
              <CForm>
                <CFormInput className="mb-3" label="Referral code*" placeholder="Referral code" required />
                <CFormInput className="mb-3" label="Your Name*" placeholder="Your Name" required />

                <CRow className="mb-3">
                  <CCol xs={8}>
                    <CFormInput type="email" placeholder="Email Id" />
                  </CCol>
                  <CCol xs={4}>
                    <CButton color="success" className="w-100 fw-small">Send OTP</CButton>
                  </CCol>
                </CRow>

                <CFormInput className="mb-3" label="Mobile No*" placeholder="Mobile No" required />
                <CFormInput className="mb-3" type="password" label="Password" placeholder="Password" required />
                <CFormInput className="mb-3" type="password" label="Confirm Password" placeholder="Confirm Password" required />

                <CButton color="info" className="w-100">Sign Up</CButton>
                <div className="text-center mt-3">
                  <small>
                    <a href="#">Forgot Password?</a>
                  </small>
                </div>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default SignupPage;
