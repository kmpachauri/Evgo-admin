import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCollapse,
    CButton
} from '@coreui/react'
import { FaChevronDown, FaChevronUp, FaListAlt, FaEdit, FaTrash } from 'react-icons/fa'
import useAxios from '../../hooks/useAxios'
import AddSectionModal from './AddSectionModal'
import DOMPurify from 'dompurify'

const SectionList = ({ sections, getPageInfo, pageId ,subId}) => {
    const [activeIndex, setActiveIndex] = useState(null)
    const { fetchData } = useAxios()
      const [showModal, setShowModal] = useState(false)
      const [content,setContent]=useState({})

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const onDelete = async (id) => {
        try {
            const res = await fetchData({
                url: `/admin/site/section/${id}`,
                method: "DELETE",

            })
            // getPageInfo()
            console.log(res)

        } catch (error) {
            console.log(error)
        }
    }

    const onEdit =(section)=>{
        console.log(section)
        try{
            setContent(section)
            setShowModal(true)

        }catch(error){

        }
    }
    return (
        <>
         {/* <AddSectionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        pageId={pageId}
        getPageInfo={getPageInfo}
        contentData={content}
        subId={subId}
      /> */}
            {sections.map((section, index) => (
                <CCard className="mb-3" key={section._id}>
                    <CCardHeader
                        onClick={() => toggle(index)}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center">
                            <FaListAlt className="me-2 text-info" />
                            <strong>{section.title}</strong>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            {/* Edit Button */}
                            <FaEdit
                                className="text-primary"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit?.(section)
                                }}
                                style={{ cursor: 'pointer' }}
                                title="Edit Section"
                            />

                            {/* Delete Button */}
                            <FaTrash
                                className="text-danger"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete?.(section._id)
                                }}
                                style={{ cursor: 'pointer' }}
                                title="Delete Section"
                            />

                            {/* Toggle Icon */}
                            {activeIndex === index ? (
                                <FaChevronUp />
                            ) : (
                                <FaChevronDown />
                            )}
                        </div>
                    </CCardHeader>

                    <CCollapse visible={activeIndex === index}>
                        <CCardBody>
                            <SectionContent content={section.content} />
                        </CCardBody>
                    </CCollapse>
                </CCard>
            ))}
        </>
    )
}

const SectionContent = ({ content }) => {
    if (!content) {
        return <div className="text-muted">No content available.</div>
    }

    if (Array.isArray(content)) {
        return (
            <ul style={{ paddingLeft: '1rem' }}>
                {content.map((item, idx) => (
                    <li key={idx} className="mb-3">
                        <strong>{item.question}</strong>
                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                    </li>
                ))}
            </ul>
        )
    }

    if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />
    }

    if (typeof content === 'object') {
        return (
            <pre style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
                {JSON.stringify(content, null, 2)}
            </pre>
        )
    }

    return <div>Unsupported content type</div>
}

export default SectionList
