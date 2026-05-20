import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../views/pages/login/Login'


const AdminLayout = () => {
  return (
    <Routes>
      
      <Route path="login" element={<Login />} />
      {/* Add more admin-specific routes here */}
    </Routes>
  )
}

export default AdminLayout
