import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../../../hooks/useAuth'
import { FaEyeSlash, FaRegEye, FaSignInAlt } from 'react-icons/fa'
import useAxios from '../../../hooks/useAxios'
import ToastNotification from '../../../components/common/Toaster'
import LoadingSpinner from '../../../components/common/LoadinSpinner'
import { ToastLiveExample } from '../../../components/CoreUiToast'
import useToastHandler from '../../../hooks/useToastHandler'
import color from '../../color'
import logo from '../../../assets/images/logo.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [bubbles, setBubbles] = useState([])

  const navigate = useNavigate()

  const { showToast, toastMessage, toastType, toastTrigger } = useToastHandler()

  const { isLogged, login, userRole } = useAuth()

  const { fetchData, loading } = useAxios()

  useEffect(() => {
    if (isLogged) {
      // check last visited page
      const lastPath = localStorage.getItem('lastPath')

      if (lastPath && lastPath !== '/login' && lastPath !== '/register') {
        navigate(lastPath, { replace: true })
      } else if (userRole === 'user') {
        navigate('/user/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isLogged, navigate, userRole])

  // Create initial bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 50,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * 5,
      xMovement: Math.random() * 20 - 10,
    }))

    setBubbles(initialBubbles)

    // Set up interval to refresh bubbles
    const interval = setInterval(() => {
      setBubbles((prevBubbles) => {
        // Remove some bubbles and add new ones
        const filteredBubbles = prevBubbles.filter(() => Math.random() > 0.3)
        const newBubbles = Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + i,
          left: Math.random() * 100,
          top: 100, // Start from bottom
          size: Math.random() * 10 + 5,
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 10 + 10,
          delay: 0,
          xMovement: Math.random() * 20 - 10,
        }))

        return [...filteredBubbles, ...newBubbles]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const validateForm = () => {
    if (!email || !password) {
      // setError('Email and password are required')
      showToast('Email and password are required', 'error')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      showToast('Please enter a valid email address', 'error')
      return false
    }

    setError('')
    return true
  }

  const submit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const data = await fetchData({
        url: '/api/v1/admin/auth/login',
        method: 'POST',
        data: { email, password, loginType: 'admin' },
      })

      if (data?.data?.role === 'user') {
        showToast('You are not authorized to access this page.', 'error')
        return
      }

      if (data.success) {
        const user = {
          name: data?.data?.name,
          email: data?.data?.email,
          id: data?.data?.id,
          role: 'admin',
        }
        login(data.data.token, user)
        showToast('Login successful! Redirecting...', 'success')
      }

      setError('')
    } catch (error) {
      setError(error.error)
      showToast(error.message || 'Login failed. Please try again.', 'error')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className="login-container">
      {/* Animated background with particles */}
      <div className="particle-background">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="particle"
              style={{
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                opacity: bubble.opacity,
              }}
              initial={{
                y: 0,
                x: 0,
                scale: 1,
                opacity: bubble.opacity,
              }}
              animate={{
                y: -150, // Move up and disappear
                x: bubble.xMovement,
                scale: [1, 1.5, 0], // Grow then disappear
                opacity: [bubble.opacity, bubble.opacity * 0.5, 0],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                ease: 'easeOut',
              }}
              onAnimationComplete={() => {
                // Remove bubble after animation completes
                setBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {loading && <LoadingSpinner />}

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5} xl={4}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="login-content"
            >
              <CCardGroup>
                <CCard className="login-card">
                  <CCardBody className="p-5">
                    <motion.div className="text-center mb-4" variants={itemVariants}>
                      <h1 className="login-title">Admin</h1>
                      <p className="login-subtitle">
                        Manage users, recharges, withdrawals, rewards, and app operations
                      </p>
                    </motion.div>

                    <CForm onKeyPress={handleKeyPress}>
                      <motion.div variants={itemVariants}>
                        <CInputGroup
                          className={`mb-4 input-group-custom ${activeField === 'email' ? 'active' : ''}`}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                        >
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="Email address"
                            autoComplete="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                          />
                          <motion.div
                            className="input-highlight"
                            initial={{ width: 0 }}
                            animate={{ width: activeField === 'email' ? '100%' : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </CInputGroup>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <CInputGroup
                          className={`mb-4 input-group-custom ${activeField === 'password' ? 'active' : ''}`}
                          onFocus={() => setActiveField('password')}
                          onBlur={() => setActiveField(null)}
                        >
                          <CInputGroupText className="input-icon">
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            autoComplete="current-password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                          />
                          <CInputGroupText
                            className="password-toggle"
                            onClick={() => !isLoading && setShowPassword(!showPassword)}
                          >
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={showPassword ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
                              </motion.span>
                            </AnimatePresence>
                          </CInputGroupText>
                          <motion.div
                            className="input-highlight"
                            initial={{ width: 0 }}
                            animate={{ width: activeField === 'password' ? '100%' : 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </CInputGroup>
                      </motion.div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CAlert color="danger" className="error-alert">
                              {error}
                            </CAlert>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div variants={itemVariants}>
                        <CButton
                          className="login-button w-100"
                          onClick={submit}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <CSpinner size="sm" className="me-2" />
                              Signing In...
                            </>
                          ) : (
                            <>
                              <FaSignInAlt className="me-2" />
                              Sign In
                            </>
                          )}
                        </CButton>
                      </motion.div>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </motion.div>
          </CCol>
        </CRow>
      </CContainer>

      <ToastNotification message={toastMessage} type={toastType} toastId={toastTrigger} />

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }



        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
        }

        .login-content {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
        }




        .login-title {
          font-weight: 700;
          color: ${color.dark};
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          background: linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .login-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .input-group-custom {
          background: ${color.light};
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
          position: relative;
        }

        .input-group-custom.active {
          border-color: ${color.primary};
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-icon {
          background: transparent;
          border: none;
          color: ${color.primary};
          min-width: 45px;
          justify-content: center;
        }

        .input-field {
          background: transparent;
          border: none;
          color: ${color.dark};
          padding: 12px;
          font-weight: 500;
        }

        .input-field::placeholder {
          color: #9ca3af;
        }

        .input-field:focus {
          background: transparent;
          color: ${color.dark};
          box-shadow: none;
        }

        .input-highlight {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, ${color.primary}, ${color.accent});
          border-radius: 2px;
        }

        .password-toggle {
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          min-width: 45px;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: ${color.primary};
        }

        .error-alert {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.2);
          color: #dc3545;
          border-radius: 10px;
          padding: 12px;
        }

        .login-button {
          background: linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%);
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .login-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .login-container {
            padding: 10px;
          }

          .login-title {
            font-size: 1.5rem;
          }

          .login-card {
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  )
}

export default Login
