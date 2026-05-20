import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CSpinner,
} from '@coreui/react'
import useAxios from './hooks/useAxios'
import { useNavigate } from 'react-router-dom'

const uploadnft = () => {
  const [nfts, setNfts] = useState([])
  const [visible, setVisible] = useState(false)
   const { fetchData} = useAxios()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
  })
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)
  const [preview, setPreview] = useState(null)



  const fetchNFTs = async () => {
    try {
setloading(true)
      const res = await fetchData({
        url: '/api/v1/admin/nft/',
        method: 'GET',
    })
      const data = res.data
      console.log(data)
      setNfts(data || [])
      setloading(false)
    } catch (err) {
      console.error('Error fetching NFTs:', err)
      setloading(false)
    }
  }

  useEffect(() => {
    fetchNFTs()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image: file })
    console.log(formData)
    setPreview(URL.createObjectURL(file))
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    postData.append('title', formData.title)
    postData.append('description', formData.description)
    postData.append('price', formData.price)
    postData.append('image', formData.image)

console.log(formData)

    try {
      const res = await fetchData({
        url: '/api/v1/admin/nft/upload',
        method: 'POST',
        data: postData

      })
        if (res.success) {
          setVisible(false)
        setFormData({ title: '', description: '', price: '', image: null })
        setPreview(null)
        fetchNFTs()
        }
        
    
    } catch (err) {
      console.error('Error uploading NFT:', err)
    } 
  }

  return (

    <CContainer fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">NFT Gallery</h3>
        <CButton color="primary" onClick={() => setVisible(true)}>
          + Add NFT
        </CButton>
      </div>
{loading ? (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
  <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} />
</div>
) : (
     <CRow>
  {nfts.map((nft, index) => (
    <CCol key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <CCard className="h-100 border-0 text-white" style={{ backgroundColor: '#111827', borderRadius: '12px' }}>
        <div style={{ position: 'relative' }}>
          <CCardImage
            orientation="top"
            src={nft?.image}
            style={{
              height: '240px',
              objectFit: 'cover',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          />
     
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#1f2937',
              padding: '6px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-heart text-white"></i>
          </div>
        </div>

        <CCardBody>
          <CCardTitle className="fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
            {nft.title?.toUpperCase()}
          </CCardTitle>

          <CCardText className="fw-swmiboald mb-1" style={{ fontSize: '0.8rem' }}>
           {nft.description}
          </CCardText>

          <CCardText className="fw-semibold" style={{ color: '#9EEBFF', fontSize: '1rem' }}>
            <i className="fas fa-link me-2"></i>{nft.price}
          </CCardText>

          <div className="text-end mt-3">
            <CButton color="warning" size="sm" className="text-dark fw-semibold px-4 rounded-pill"
            onClick={() => navigate(`/user/price-wise-nft/${nft.price}`)}
            >
              View <i className="fas fa-arrow-right ms-2"></i>
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  ))}
</CRow>
  )}

      {/* Modal */}
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <strong>Upload New NFT</strong>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CFormLabel>Title</CFormLabel>
            <CFormInput
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <CFormLabel className="mt-2">Description</CFormLabel>
            <CFormTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              required
            />

            <CFormLabel className="mt-2">Price (₹)</CFormLabel>
            <CFormInput
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />

            <CFormLabel className="mt-2">Image</CFormLabel>
            <CFormInput type="file" accept="image/*" onChange={handleImageChange} required />

            {preview && (
              <div className="mt-2 text-center">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ maxHeight: '150px', borderRadius: '8px' }}
                />
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Upload'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default uploadnft

