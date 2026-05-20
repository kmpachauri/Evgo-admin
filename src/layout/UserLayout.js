import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from '../views/pages/register/Register'

const UserLayout = () => {
  return (
    <Routes>
      
      <Route path="auth" element={<Register />} />
      {/* Add more user-specific routes here */}
    </Routes>
  )
}

export default UserLayout
