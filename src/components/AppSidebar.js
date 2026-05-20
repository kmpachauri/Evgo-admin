import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '../assets/images/logo.jpg'

// sidebar nav config
import navigation from '../_nav'
import useNavigation from '../hooks/useNavigation'
import { useData } from '../hooks/useData'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const { siteTabs,
    setSiteTabs, getAllLists } = useData()

  useEffect(() => {
    getAllLists()
  }, [])
  console.log(unfoldable)
  return (
    <CSidebar
      className="border-end custom-sidebar"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >

      <CSidebarHeader className="d-flex w-100 overflow-hidden gap-2 justify-content-center align-items-center">
        <CSidebarBrand style={{ textDecoration: "none" }}>
          <div className='d-flex w-100 h-50 gap-2 justify-content-center align-items-center'>
            {/* <img
              src={logo}
              width={"60%"}
              height={"100%"}
             /> */}
            <h4 style={{
              // color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontFamily: "Poppins ",
              textUnderlineOffset: "none",
            }}>ADMIN</h4>
          </div>
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={siteTabs} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
