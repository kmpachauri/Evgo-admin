import React, { useEffect } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import useAuth from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AlertBar } from '../components/common/AlertBar'

const excludedPaths = ['/login', '/register', '/404', '/500', '/admin/login']

const DefaultLayout = () => {
  const { isLogged, adminAsUser } = useAuth()
  const location = useLocation()

  // Save last path whenever user navigates (but ignore auth/error pages)
  useEffect(() => {
    if (!isLogged) return
    const path = location.pathname + (location.search || '')
    if (!excludedPaths.includes(location.pathname)) {
      localStorage.setItem('lastPath', path)
    }
    // debugging: remove later
    console.log('[DefaultLayout] saved lastPath=', localStorage.getItem('lastPath'), 'location=', path)
  }, [location, isLogged])

  if (!isLogged) {
    // Clear any stale data
    localStorage.removeItem('lastPath');
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <Toaster />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        {adminAsUser && <AlertBar />}
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
