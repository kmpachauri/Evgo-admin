import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import Swal from 'sweetalert2'
import avatar8 from './../../assets/images/avatars/profile.png'
import useAuth from '../../hooks/useAuth'

const AppHeaderDropdown = () => {
  const { logout } = useAuth()

  // 🔹 Logout confirmation handler
  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        logout() // 👈 actual logout function
        localStorage.removeItem('lastPath') 
      }
    })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Account
        </CDropdownHeader>

        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          Logout
          <CIcon icon={cilAccountLogout} className="ms-2" />
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
