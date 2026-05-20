// Export.js
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import React from 'react'
import color from './color'
import { exportToExcel, exportToPDF, exportToWordPress } from '../help/DownloadFiles'

const Export = ({ userdata, fields }) => {
  return (
    <CDropdown>
      <CDropdownToggle
        style={{
          background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
          border: 'none',
          color: 'white',
        }}
      >
        Export
      </CDropdownToggle>

      <CDropdownMenu
        style={{
          background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
        }}
      >
        {[
          { label: 'Excel', action: () => exportToExcel(userdata, fields) },
          { label: 'PDF', action: () => exportToPDF(userdata, fields) },
          { label: 'Word', action: () => exportToWordPress(userdata, fields) },
        ].map((item, index) => (
          <CDropdownItem
            key={index}
            onClick={item.action}
            style={{
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
          >
            {item.label}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default Export
