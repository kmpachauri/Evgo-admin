import React, { useEffect, useState } from 'react'
import './ImageGallery.css'
import {
    CCard, CCardBody, CCardImage, CRow, CCol,
    CFormInput, CButton, CContainer, CToast, CToastBody, CToastHeader
} from '@coreui/react'
import useAxios, { baseUrl, imgBaseUrl } from '../hooks/useAxios'

const Images = () => {
    const [url, setUrl] = useState('')
    const [showToast, setShowToast] = useState(false)
    const [allImages,setAllImages]=useState([])

    const [file, setFile] = useState('')
    const { fetchData } = useAxios()

const getAllImages = async ()=>{
    try {
        const res= await fetchData({
            url:"/admin/assets"
        })
        setAllImages(res.data)
        console.log(res)
    } catch (error) {
        console.log(error)
    }
}

    const handleFie = (event) => {
        // console.log()
        console.log(event.target.files[0])
        setFile(event.target.files[0])

    }

    const uploadImage = async () => {
        const payload = new FormData()
        payload.append('file', file)

        try {
            const res = await fetchData({
                url: "/admin/asset/upload",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                method: "POST",
                data: payload
            })
            console.log(res)
            getAllImages()

        } catch (error) {

        }
    }

    const copyText = (url) => {
        setUrl(url)
        setShowToast(false)
        setTimeout(() => {
            setShowToast(true)
        }, 100)
    }

    useEffect(()=>{
        getAllImages()
    },[])

    return (
        <CContainer className="py-4">
            {/* Upload Section */}
            <CRow className="align-items-center mb-4">
                <CCol xs={9}>
                    <CFormInput type="file"  onChange={handleFie} />
                </CCol>
                <CCol xs={3}>
                    <CButton color="primary" className="w-100" onClick={uploadImage}>Upload</CButton>
                </CCol>
            </CRow>

            {/* Toast Message */}
            <div className="toast-wrapper">
                <CToast animation autohide visible={showToast}>
                    <CToastHeader closeButton>
                        <svg className="rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#007aff"></rect>
                        </svg>
                        <div className="fw-bold me-auto">Social Downloader</div>
                        <small>Just now</small>
                    </CToastHeader>
                    <CToastBody><strong>Copied:</strong> {url}</CToastBody>
                </CToast>
            </div>

            {/* Image Gallery */}
            <ImageGallery url={url} setSHowToast={setShowToast} copyText={copyText}  allImages={allImages}/>
        </CContainer>
    )
}

export default Images

const images = [
    'https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531177076128-acef7e0dfe3d?auto=format&fit=crop&w=600&q=80',
]

const ImageGallery = ({ url, setSHowToast, copyText ,allImages }) => {
    const handleCopy = (url) => {
        navigator.clipboard.writeText(url)
        copyText(url)
    }

    return (
        <CRow className="g-4">
        {allImages.length ? <>
            {allImages.map((src, index) => (
                <CCol key={index} xs={12} sm={6} md={4}>
                    <div className="img-wrapper">
                        <CCard className="image-card">
                            <div className="image-container">
                                <CCardImage
                                    orientation="top"
                                    src={`${imgBaseUrl}${src.url}`}
                                    alt={`Gallery Image ${index + 1}`}
                                    className="gallery-image"
                                />
                                <div className="overlay" onClick={() => handleCopy(`${imgBaseUrl}${src.url}`)}>Copy</div>
                            </div>
                            <CCardBody>
                                <h6 className="text-center mb-0">Image {index + 1}</h6>
                            </CCardBody>
                        </CCard>
                    </div>
                </CCol>
            ))}
        </>:<></>}
            
        </CRow>
    )
}
