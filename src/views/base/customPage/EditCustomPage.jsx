import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios from '../../../hooks/useAxios'
import { imageFullUrl } from '../../helper'
import LoadingSpinner from '../../../components/common/LoadinSpinner'
import JoditEditor from 'jodit-react';

const EditPaymentProfile = ({ placeholder }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fetchData, loading } = useAxios()

  // Extract id from query parameters
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get('id')

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    html: null,
  })

  useEffect(() => {
    if (!id) return // Prevent API call if id is missing

    const fetchSetting = async () => {
      try {
        const res = await fetchData({ url: `/admin/page/${id}` })
        if (res.success) {
          setFormData({
            name: res.data.name,
            title: res.data.title,
            description: res.data.description,
            html: res.data.html,
          })
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to fetch setting')
      }
    }
    fetchSetting()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, html: e.target.files[0] })
  }
  // const res = await fetchData({
  //     url: `/admin/order/${id}`,
  //     method: "PUT",
  //     data: { status },
  //   });
  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(content)
    // console.log(formData)
    // return
    // const data = new FormData()
    // data.append('name', formData.name)
    // data.append('title', formData.title)
    // data.append('description', formData.description)
    // if (formData.html instanceof File) {
    //   data.append('html', formData.html) // Only append if a new file is selected
    // }

    try {
      const res = await fetchData({
        url: `/admin/page/${id}`,
        method: 'PUT',
        data: formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      })
      console.log(res)
      if (res.success) {
        toast.success('Custom Page Updated Successfully')
        navigate('/custom-page')
      } else {
        toast.error(res?.message || res?.error || 'Failed to update profile')
      }
    } catch (error) {
      console.log(error)
      toast.error(`${error?.error || 'Error updating page'}`)
    }
  }

  const editor = useRef(null);
	const [content, setContent] = useState('');

	const config = useMemo(() => ({
			readonly: false, // all options from https://xdsoft.net/jodit/docs/,
			placeholder: placeholder || 'Start typings...'
		}),
		[placeholder]
	);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loading && <LoadingSpinner />}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '60%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>description ID</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>HTML</label>
            {/* <textarea
              type="text"
              name="html"
              value={formData.html}
              onChange={handleChange}
              style={{ height: '10rem', width: '100%', padding: '8px' }}
            /> */}

            <JoditEditor
			ref={editor}
			value={formData.html}
			config={config}
			tabIndex={1} // tabIndex of textarea
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {
        // handleChange(newContent)
        setFormData((pre)=>({...pre , html :newContent}))
      }}
		/>
            {/* {formData.html && !(formData.html instanceof File) && (
              <div>
                <img
                  src={imageFullUrl(formData.html)}
                  alt="QR Code"
                  height="80"
                  width="80"
                  style={{ marginTop: '10px' }}
                />
              </div>
            )} */}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditPaymentProfile
