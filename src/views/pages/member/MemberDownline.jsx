import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CLink,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

import useAxios from '../../../hooks/useAxios'
import ImagePreviewModal from '../../../components/common/ImageViewModal'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../../components/common/LoadinSpinner'
import DynamicTable from '../../../components/common/Table/DynamicTable'
import { MemberDownline_tableHeaders } from '../../../components/HeaderData/AllHeaders'

const MemberDownline = () => {
  const { fetchData, loading } = useAxios()

  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  


  return (
    <CCard className="mb-4">
      {loading && <LoadingSpinner />}
      <CCardBody>
        
        <DynamicTable
          headers={MemberDownline_tableHeaders}
        />

      </CCardBody>

      <ImagePreviewModal
        imageUrl={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </CCard>
  )
}

export default MemberDownline
