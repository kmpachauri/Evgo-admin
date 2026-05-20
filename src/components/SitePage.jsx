import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CContainer,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
  CModalTitle,
  CFormInput,
} from '@coreui/react'
import useAxios from '../hooks/useAxios'
import SectionList from './sitesPage/SectionList'
import AddSectionModal from './sitesPage/AddSectionModal'
import { useData } from '../hooks/useData'


const SitePage = () => {
  const { name, id, subId } = useParams()
  const [pageData, setPageData] = useState(null)
  const { fetchData } = useAxios()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [update, setUPdate] = useState(false)
  const { getAllLists } = useData()
  const [updateProps, setUpateProps] = useState({
    slug: "",
    title: ""
  })
  const [showSubPageModal, setShowSubPageModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)

  const [subPageForm, setSubPageForm] = useState({
    title: '',
    slug: '',
    metaTitle: "",
    metaDescription: ""
  })

  const getPageInfo = async () => {
    try {
      let url = subId ? `/admin/site/sub-page/${subId}` : `/admin/site/page/${id}`
      const res = await fetchData({ url: url })
      setPageData(res.data)
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   getPageInfo()
  // }, [id, subId])

  const handleDeletePage = async (pageId) => {
    let url = subId ? `/admin/site/sub-page/${subId}` : `/admin/site/page/${id}`
    try {
      await fetchData({

        url: url,
        method: "DELETE"

      })
      getAllLists(true)
      // alert('Page deleted successfully')
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleAddSection = async ({ title }) => {
    try {
      await postData({
        url: `/admin/site/section`,
        body: {
          pageId: id,
          title,
          type: 'others',
          content: [],
        },
      })
      setShowModal(false)
      // getPageInfo()
    } catch (err) {
      console.error('Error adding section:', err)
    }
  }

  const handleCreateSubPage = async () => {
    try {
      const payload = {
        title: subPageForm.title,

        metaTitle: subPageForm.metaTitle,
        metaDescription: subPageForm.metaDescription
      }
      if (subPageForm.slug.startsWith('/')) {
        payload.slug = subPageForm.slug
      }
      else {
        payload.slug = `/${subPageForm.slug}`

      }
      if (update) {
        const url = subId ? `/admin/site/sub-page/${subId}` : `/admin/site/page/${id}`

        if (subId) {
          payload.pageId = id
        }
        await fetchData({
          url: url,
          method: "PUT",
          data: payload,
        })
        // getPageInfo()
      } else {
        if (id) {
          payload.pageId = id
        }
        await fetchData({
          url: '/admin/site/sub-page',
          method: "POST",
          data: payload
        })
      }

      setSubPageForm({ title: '', slug: '', metaTitle: "", metaDescription: "" })
      setShowSubPageModal(false)
      getAllLists(true)
      // getPageInfo()
    } catch (error) {
      console.error('Error creating subpage:', error)
    }
  }

  const updteSubpage = () => {
    // setUpateProps((pre) => ({ ...pre, slug: pageData.slug, title: pageData.title }))
    setSubPageForm((pre) => ({ ...pre, slug: pageData.slug, title: pageData.title, metaTitle: pageData?.metaTitle, metaDescription: pageData?.metaDescription }))
    setShowSubPageModal(true)
    setUPdate(true)
  }
  const createSubpage = () => {
    // setUpateProps((pre) => ({ ...pre, slug: pageData.slug, title: pageData.title }))
    setSubPageForm((pre) => ({ ...pre, slug: "", title: "", metaDescription: "", metaTitle: "" }))
    setShowSubPageModal(true)
    setUPdate(false)
  }
  return (
    <CContainer className="py-4">
      <CRow className="mb-3 justify-content-between align-items-center">
        <CCol>
          <h2 className="mb-0 text-capitalize">{name?.replace('-', ' ')}</h2>
        </CCol>

        <CCol className="text-end d-flex justify-content-end gap-2">
          <CButton color="info" onClick={() => updteSubpage(true)}>
            Update {subId ? "Subpage" : "Page"}
          </CButton>
          <CButton color="info" onClick={() => createSubpage(true)}>
            Create SubPage
          </CButton>
          {/* <DeletePageButton pageId={id} onDelete={handleDeletePage} /> */}
        </CCol>
      </CRow>

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : (
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Page Sections</h5>
            <CButton color="success" onClick={() => setShowModal(true)}>
              Add Section
            </CButton>
          </CCardHeader>
          {/* <CCardBody>
            {pageData?.sections?.length > 0 ? (
              <SectionList
                sections={pageData.sections}
                getPageInfo={getPageInfo}
                pageId={id}
                subId={subId}
              />
            ) : (
              <p className="text-muted">No sections available.</p>
            )}
          </CCardBody> */}
        </CCard>
      )}

      {/* Modals */}
      {/* <AddSectionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        pageId={id}
        getPageInfo={getPageInfo}
        subId={subId}
      /> */}

      <CModal visible={showSubPageModal} onClose={() => setShowSubPageModal(false)}>
        <CModalHeader>
          <CModalTitle>{update ? "Update" : "Create"} {subId ? "Sub Page":"Page"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            className="mb-3"
            label="Title"
            placeholder="Enter subpage title"
            value={subPageForm.title}
            onChange={(e) =>
              setSubPageForm({ ...subPageForm, title: e.target.value })
            }
          />
          <CFormInput
            label="Slug"
            placeholder="/your-slug"
            value={subPageForm.slug}
            onChange={(e) =>
              setSubPageForm({ ...subPageForm, slug: e.target.value })
            }
          />
          <CFormInput
            label="Meta Title"
            placeholder="Meta Title"
            value={subPageForm.metaTitle}
            onChange={(e) =>
              setSubPageForm({ ...subPageForm, metaTitle: e.target.value })
            }
          />
          <CFormInput
            label="Meta Description"
            placeholder="Meta Description"
            value={subPageForm.metaDescription}
            onChange={(e) =>
              setSubPageForm({ ...subPageForm, metaDescription: e.target.value })
            }
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowSubPageModal(false)}>
            Cancel
          </CButton>
          {/* <CButton
            color="primary"
            onClick={handleCreateSubPage}
            disabled={!subPageForm.title || !subPageForm.slug || !subPageForm.metaDescription || !subPageForm.metaTitle}
          >
            {update ? "Update" : "Create"}
          </CButton> */}
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default SitePage





const DeletePageButton = ({ pageId, onDelete }) => {
  const [visible, setVisible] = useState(false)
  const { deleteSiteTab } = useData()
  const navigate = useNavigate()
  const handleDelete = () => {
    // deleteSiteTab(pageId)
    // onDelete?.(pageId)
    onDelete()
    setVisible(false)
    navigate(-1)
  }

  return (
    <>
      <CButton color="danger" onClick={() => setVisible(true)}>
        Delete
      </CButton>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <strong>Confirm Deletion</strong>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this page?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export { DeletePageButton }
