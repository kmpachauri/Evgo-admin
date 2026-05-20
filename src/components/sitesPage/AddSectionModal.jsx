import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    CModal, CModalHeader, CModalBody, CModalFooter,
    CButton, CFormInput, CFormLabel, CForm, CFormSwitch
} from '@coreui/react'
import JoditEditor from 'jodit-react'
import useAxios from '../../hooks/useAxios'

const AddSectionModal = ({ visible, pageId, onClose, getPageInfo, placeholder, contentData, subId }) => {
    const editor = useRef(null)
    const { fetchData } = useAxios()

    const [title, setTitle] = useState('')
    const [contentType, setContentType] = useState('html') // html or faq
    const [htmlContent, setHtmlContent] = useState('')
    const [faqContent, setFaqContent] = useState([{ question: '', answer: '' }])

    useEffect(() => {
        if (contentData) {
            setTitle(contentData.title || '')
            if (Array.isArray(contentData.content)) {
                setContentType('faq')
                setFaqContent(contentData.content)
            } else {
                setContentType('html')
                setHtmlContent(contentData.content || '')
            }
        } else {
            setTitle('')
            setHtmlContent('')
            setFaqContent([{ question: '', answer: '' }])
            setContentType('html')
        }
    }, [visible, contentData])

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...',
    }), [placeholder])

    const handleFaqChange = (index, field, value) => {
        const updated = [...faqContent]
        updated[index][field] = value
        setFaqContent(updated)
    }

    const addFaq = () => {
        setFaqContent([...faqContent, { question: '', answer: '' }])
    }

    const removeFaq = (index) => {
        const updated = faqContent.filter((_, i) => i !== index)
        setFaqContent(updated)
    }

    const handleSubmit = async () => {
        if (title.trim()) {
            const payload = {
                title,
                content: contentType === 'faq' ? faqContent : htmlContent,
                pageId,
                type: 'others',
            }
            if(subId){
                payload.subPageId=subId
            }

              let url  
            if (contentData) {
                url = `/admin/site/section/${contentData._id}`
            }else{
                url=`/admin/site/section`
            }
            const method = contentData ? 'PUT' : 'POST'

            try {
                await fetchData({ url, method, data: payload })
                getPageInfo()
                onClose()
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <strong>{contentData ? 'Edit' : 'Add'} Section</strong>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <div className="mb-3">
                        <CFormLabel>Section Title</CFormLabel>
                        <CFormInput
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter section title"
                        />
                    </div>

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <label>Use FAQ Mode</label>
                        <CFormSwitch
                            checked={contentType === 'faq'}
                            onChange={() => setContentType(contentType === 'faq' ? 'html' : 'faq')}
                        />
                    </div>

                    {contentType === 'html' ? (
                        <JoditEditor
                            ref={editor}
                            value={htmlContent}
                            config={config}
                            onBlur={(newContent) => setHtmlContent(newContent)}
                            onChange={() => { }}
                        />
                    ) : (
                        <>
                            {faqContent.map((item, index) => (
                                <div key={index} className="mb-4 border p-3 rounded bg-light">
                                    <CFormLabel>Question {index + 1}</CFormLabel>
                                    <CFormInput
                                        value={item.question}
                                        onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                        placeholder="Enter question"
                                        className="mb-2"
                                    />
                                    <CFormLabel>Answer</CFormLabel>
                                    <CFormInput
                                        value={item.answer}
                                        onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                        placeholder="Enter answer"
                                    />
                                    {faqContent.length > 1 && (
                                        <CButton color="danger" size="sm" className="mt-2" onClick={() => removeFaq(index)}>
                                            Remove
                                        </CButton>
                                    )}
                                </div>
                            ))}
                            <CButton color="info" onClick={addFaq}>Add More Q&A</CButton>
                        </>
                    )}
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Cancel</CButton>
                <CButton color="primary" onClick={handleSubmit}>
                    {contentData ? 'Update' : 'Add'}
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default AddSectionModal
