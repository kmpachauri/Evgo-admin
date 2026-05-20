import { createContext, useContext, useEffect, useState } from 'react'
import ToastNotification from '../components/common/Toaster'
import useToastHandler from '../hooks/useToastHandler'

export const toastContext = createContext(null)

export const ContextProvider = ({ children }) => {
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState(null)
  const [toastTrigger, setToastTrigger] = useState(0)

  useEffect(() => {
    setToastMessage(null)
    setToastType(null)
    setToastTrigger(0)
  }, [])

  const showToast = (message, type = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setToastTrigger(Date.now()) // or just +1 counter
  }

  return (
    <toastContext.Provider value={{ showToast, toastMessage, toastType, toastTrigger }}>
      {children}
      <ToastNotification message={toastMessage} type={toastType} toastId={toastTrigger} />
    </toastContext.Provider>
  )
}
