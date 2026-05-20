import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage,
  CAlert,
  CSpinner,
  CNav,
  CNavItem,
  CNavLink,
  CFormLabel
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import useAuth from '../../../hooks/useAuth';
import banner from '../../../assets/images/testimonial-background.jpg';
import logo from '../../../assets/images/logo-high.webp';
import { FaEyeSlash, FaRegEye } from 'react-icons/fa';
import useAxios from '../../../hooks/useAxios';
import ToastNotification from '../../../components/common/Toaster';
import LoadingSpinner from '../../../components/common/LoadinSpinner';
import axios from 'axios';
import useToastHandler from '../../../hooks/useToastHandler';

const Login = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [showOTPinput, setShowOTPinput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [LoginSuccess, setLoginSuccess] = useState(false);
  const [SingUPSuccess, setSingUPSuccess] = useState(true);
  const [validated, setValidated] = useState(false)
  const { showToast, toastMessage, toastType, toastTrigger } = useToastHandler()
  const {
    isLogged, login } = useAuth();
    const [searchParams] = useSearchParams()
  const inviteCode = searchParams.get('InviteCode')
console.log(inviteCode)
useEffect(()=>{
  if (inviteCode) {
    setReferrerCode(inviteCode)
  }
},[])
  const { fetchData, loading } = useAxios()
  const validateForm = () => {
    if (!email) {
      setError('Email and password are required');
      return false;
    }
    setError('');
    return true;
  };





  const sendOTP = async () => {
    console.log('clicked')

    if (!email) {
      showToast('Email is required.', 'error')

      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return;
    }
    if (!validateForm()) return;
    try {
      const data = await fetchData({
        url: '/api/v1/user/auth/send-email-otp',
        method: 'POST',
        data: {
          email
        }
      });
      console.log(data);
      setShowOTPinput(true)
      setError("");
    } catch (error) {

      console.log(error);
      setError(error.error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(validated)
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error')
      return;
    }

    // const otp = emailOTP;
    // if (isNaN(otp)) {
    //   showToast('Please enter a valid OTP.', 'error')

    //   return;
    // }
    // if (otp.length !== 6) {
    //   showToast('OTP must be 6 digits.', 'error')

    //   return;
    // }

    if (!validateForm()) return;
    try {
      const data = await fetchData({
        url: '/api/v1/user/auth/register',
        method: 'POST',
        data: {
          name,
          phone,
          email,
          // emailOTP: parseInt(emailOTP),
          password,
          referrerCode
        }
      });
      //  setSingUPSuccess(true)
      setError("");
    } catch (error) {

      console.log(error);
      setError(error.error);
    }

  };
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (email === '') {
      showToast('Email is required.', 'error')
      return;
    }
    if (password === '') {

      showToast('Passwords is required.', 'error')
      return;
    }

    try {
      const data = await fetchData({
        url: '/api/v1/user/auth/login',
        method: 'POST',
        data: {
          email,
          password
        }
      });
      if (data.success) {
        console.log(data)
        login(data.data.token, data.data)
      }
      console.log(data)
      // setLoginSuccess(true);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.error);
    }
  };



  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #fff 0%, #000 100%)' }}>
      {loading && <LoadingSpinner />}  {/* Show overlay spinner when loading */}

      <CContainer >
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup className="shadow-lg">
              <CCard className="p-4 text-dark" style={{background: 'linear-gradient(135deg, #fff 0%, #000 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)' }}>
                <div className="text-center mb-3">
                  <CImage src={logo} height={50} alt="Logo" />
                </div>
                <CNav variant="pills" layout="justified" >
                  <CNavItem className=''>
                    <CNavLink
                      style={{
                        backgroundColor: activeTab == 'login' && 'black',
                        color: activeTab == 'login' ? 'white' : 'black',
                        cursor: 'pointer'
                      }}
                      className='hover:link-underline'
                      active={activeTab === 'login'}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      style={{
                        backgroundColor: activeTab == 'signup' && 'black',
                        color: activeTab == 'signup' ? 'white' : 'black',
                        cursor: 'pointer'
                      }}
                      active={activeTab === 'signup'}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </CNavLink>
                  </CNavItem>
                </CNav>


                {error && <CAlert color="danger">{error}</CAlert>}
                <CCardBody>

                  {activeTab === 'login' && <CForm onSubmit={handleLoginSubmit}>





                    <CInputGroup className="mb-3">
                      <CInputGroupText className="bg-transparent border-1">
                        <CIcon icon={cilUser} className="text-dark" />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter your Email"
                        autoComplete="email"
                        type='email'
                        className="bg-transparent text-dark border-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      {/* <CInputGroupText className="bg-transparent border-1">
                        <CIcon icon={cilLockLocked} className="text-dark" />
                      </CInputGroupText> */}
                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="bg-transparent text-dark border-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText className="bg-transparent border-1" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash color='dark' /> : <FaRegEye color='dark' />}
                      </CInputGroupText>
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#1a202c', transition: 'all 0.3s ease-in-out' }}
                          className="w-100 fw-bold"
                          onMouseOver={(e) => (e.target.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.8)')}
                          onMouseOut={(e) => (e.target.style.boxShadow = 'none')}
                          type='submit'
                        >
                          Sign In
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton href='/register' color="link" className="text-warning">Forgot Password?</CButton>
                      </CCol>
                    </CRow>

                  </CForm>}

                  {activeTab === 'signup' && <CForm className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}>




                    <CInputGroup className="">
                      {/* <CFormLabel htmlFor="exampleFormControlInput1">Email address</CFormLabel> */}
                      {/* <CInputGroupText className="bg-transparent border-1">
                        <CIcon icon={cilUser} className="text-dark" />
                      </CInputGroupText> */}
                      <CFormInput
                      
                        placeholder="Referral code*"
                        autoComplete="text"
                        feedback="Looks good!"
                        type='text'
                        id="validationTextarea"
                        className="bg-transparent text-dark border-1 dark-placeholder"
                        value={referrerCode}
                        onChange={(e) => setReferrerCode(e.target.value)}
                        required
                        disabled={inviteCode ? true : false}
                      />
                    </CInputGroup>
                    <CInputGroup className="">

                      <CFormInput
                        placeholder="Your Name*"
                        autoComplete="text"
                        type='text'
                        className="bg-transparent text-dark border-1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </CInputGroup>
                     <CInputGroup className="">

                          <CFormInput
                            placeholder="Enter your Email"
                            type="email"
                            className="bg-transparent text-dark border-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </CInputGroup>

                    {/* <CRow className="">
                      <CCol xs={8}>
                        <CInputGroup className="">

                          <CFormInput
                            placeholder="Enter your Email"
                            type="email"
                            className="bg-transparent text-dark border-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol xs={4}>
                        <CButton type='button' disabled={!email} style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#1a202c', transition: 'all 0.3s ease-in-out' }} className="w-100 fw-medium" onClick={sendOTP}>Send OTP</CButton>
                      </CCol>
                    </CRow> */}
                    {/* {showOTPinput && <CInputGroup className="">

                      <CFormInput
                        placeholder="OTP*"
                        type="number"
                        className="bg-transparent text-dark border-1"
                        value={emailOTP}
                        onChange={(e) => setEmailOTP(e.target.value)}
                        required
                      />
                    </CInputGroup>} */}
                    <CInputGroup className="">

                      <CFormInput
                        placeholder="Mobile No*"
                        type="number"
                        className="bg-transparent text-dark border-1"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CInputGroup className="">

                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="bg-transparent text-dark border-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText className="bg-transparent border-1" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash color='dark' /> : <FaRegEye color='dark' />}
                      </CInputGroupText>
                    </CInputGroup>
                    <CInputGroup className="mb-4">

                      <CFormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Confirm password"
                        autoComplete="current-password"
                        className="bg-transparent text-dark border-1"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText className="bg-transparent border-1" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash color='dark' /> : <FaRegEye color='dark' />}
                      </CInputGroupText>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#1a202c', transition: 'all 0.3s ease-in-out' }}
                          className="w-100 fw-bold"
                          onMouseOver={(e) => (e.target.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.8)')}
                          onMouseOut={(e) => (e.target.style.boxShadow = 'none')}
                          type='submit'
                        >
                          Sign Up
                        </CButton>
                      </CCol>

                    </CRow>

                  </CForm>}
                  <CCol xs={12} className="text-end">
                    <CButton href='/admin/login' color="link" className="text-warning">Admin Login</CButton>
                  </CCol>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

      {/* Toast Notification Component */}
      <ToastNotification message={toastMessage} type={toastType} toastId={toastTrigger} />
    </div>
  );
};

export default Login;
