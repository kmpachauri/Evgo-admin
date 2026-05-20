import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import routes from '../routes'

const AppBreadcrumb = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Function to get route name from the pathname
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  // Function to generate breadcrumbs dynamically
  const getBreadcrumbs = (location) => {
    const pathSegments = location.pathname.split('/').filter(Boolean) // Remove empty strings
    let currentPath = ''
    const breadcrumbs = pathSegments.map((segment, index) => {
      currentPath += `/${segment}`
      const routeName = getRouteName(currentPath, routes)
      return routeName
        ? {
            pathname: currentPath,
            name: routeName,
            active: index === pathSegments.length - 1,
          }
        : null
    }).filter(Boolean) // Remove null values

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(location)

  return (
    <CBreadcrumb className="my-0">
      {/* <CBreadcrumbItem onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        Home
      </CBreadcrumbItem> */}
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          active={breadcrumb.active}
          onClick={() => !breadcrumb.active && navigate(breadcrumb.pathname)}
          style={{ cursor: breadcrumb.active ? 'default' : 'pointer' }}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
