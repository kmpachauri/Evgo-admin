import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  

  const navLink = (name, icon, badge, indent = false, isActive = false, hover = false) => (
    <>
      {icon
        ? React.cloneElement(icon, {  })
        : indent && (
          <span className="nav-icon">
            <span
              className="nav-icon-bullet"
              // style={{ backgroundColor: isActive || hover ? 'black' : 'white' }}
            ></span>
          </span>
        )}
      {name && <span >{name}</span>}
      {badge && (
        <CBadge
          color={badge.color}
          className="ms-auto"
          size="sm"
          style={{ color: isActive || hover ? 'black' : 'white', backgroundColor: badge.color }}
        >
          {badge.text}
        </CBadge>
      )}
    </>
  )

  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, to, ...rest } = item
    const Component = component
    const isActive = to && location.pathname === to
    const [hover, setHover] = useState(false)

    return (
      <Component as="div" key={index}>
        {to ? (
          <CNavLink
            as={NavLink}
            to={to}
            {...rest}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={isActive ? 'c-active' : ''}
          >
            {navLink(name, icon, badge, indent, isActive, hover)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent, false, hover)
        )}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, items, ...rest } = item
    const Component = component
    return (
      <Component
        compact
        as="div"
        key={index}
        toggler={navLink(name, icon)}
        visible={rest.visible ?? true}
        {...rest}
      >
        {items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true)
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items && items.map((item, index) => {
        if (item.component?.displayName === 'CNavTitle' || item.component?.name === 'CNavTitle') {
          const TitleComp = item.component
          return <TitleComp key={index}>{item.name}</TitleComp>
        }
        return item.items ? navGroup(item, index) : navItem(item, index)
      })}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
