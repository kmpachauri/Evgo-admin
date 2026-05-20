import React, { useEffect, useState } from 'react'
import useAxios from './useAxios'
import { CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExternalLink, cilFindInPage, cilSpeedometer } from '@coreui/icons'
import { useData } from './useData'

const useNavigation = () => {
  const { fetchData } = useAxios()
  const {siteTabs,
    setSiteTabs,}=useData()
  const [nav, setNav] = useState([
    
  ])

  const getAllLists = async () => {
    try {
      const res = await fetchData({
        url: '/admin/site/page',
      })

      const pageData = res.data

      // Create new nav items from API
      const dynamicItems = pageData.map((page) => ({
        component: CNavItem,
        name: page.title,
        to: page.slug || '/',
      }))

      // Inject dynamic items into Site Tabs
      setSiteTabs((prevNav) =>
        prevNav.map((item) => {
          if (item.name === 'Site Tabs' && Array.isArray(item.items)) {
            return {
              ...item,
              items: [...item.items, ...dynamicItems], // Append or use only dynamicItems if you want to override
            }
          }
          return item
        })
      )
    } catch (error) {
      console.error('Error fetching site pages:', error)
    }
  }

  // useEffect(() => {
  //   getAllLists()
  // }, [])

  return {
    nav,
    getAllLists,
  }
}

export default useNavigation
