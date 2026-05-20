import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CNavLink,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMoon,
  cilSun,
  cilContrast,
  cilMenu,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import useAxios from '../hooks/useAxios'
import useNavigation from '../hooks/useNavigation'
import { useData } from '../hooks/useData'
import ToastNotification from './common/Toaster'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { fetchData } = useAxios()
  const { getAllLists } = useData()

  const [visible, setVisible] = useState(false)
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [showMessages, setShowMessages] = useState({ message: '', type: '' })

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const resetInput = () => {
    setSlug('')
    setTitle('')
    setMetaTitle('')
    setMetaDescription('')
  }

  const handleCreateSiteTab = async () => {
    console.log('this')
    const payload = {
      title,
      metaTitle,
      metaDescription,
      slug: slug.startsWith('/') ? slug : `/${slug}`,
    }

    try {
      const res = await fetchData({
        url: '/admin/site/page',
        method: 'POST',
        data: payload,
      })

      setVisible(false)
      resetInput()
      getAllLists(true)

      setShowMessages({
        message: 'Page Created',
        type: 'success',
      })
    } catch (error) {
      setShowMessages({
        message: error?.error || 'Something went wrong!',
        type: 'error',
      })
    }
  }

  return (
    <>
      <ToastNotification message={showMessages.message} type={showMessages.type} />

      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer fluid className="border-bottom px-4">
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <CHeaderNav className="d-none d-md-flex">
              <AppBreadcrumb />
          </CHeaderNav>

          <CHeaderNav className="ms-auto"></CHeaderNav>

          {/* <CButton color="primary" className="ms-2" onClick={() => setVisible(true)}>
            Create Site Tab
          </CButton> */}

          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            <CDropdown variant="nav-item" placement="bottom-end" style={{ cursor: 'pointer' }}>
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>

            <AppHeaderDropdown />
          </CHeaderNav>
        </CContainer>

        {/* <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer> */}
      </CHeader>

      {/* Modal for Creating Site Tab */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Create Site Tab</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Slug</label>
            <CFormInput
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="/home"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <CFormInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="home"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <CFormInput
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta Title"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <CFormInput
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta Description"
            />
          </div>
          <div className="d-flex justify-content-end">
            {/* <CButton color="success" onClick={handleCreateSiteTab}>
              Save
            </CButton> */}
          </div>
        </CModalBody>
      </CModal>
    </>
  )
}

export default AppHeader
