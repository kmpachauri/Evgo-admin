import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios, { baseUrl } from '../../../hooks/useAxios'
import LoadingSpinner from '../../../components/common/LoadinSpinner'

const CreateCustomPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    html: null,
  })

  const { fetchData, loading } = useAxios()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, html: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('name', formData.name)
    data.append('title', formData.title)
    data.append('description', formData.description)
    if (formData.html) {
      data.append('html', formData.html)
    }

    try {
      const response = await fetchData({
        url: `/admin/page/create`,
        method: 'POST',
        data: formData,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      })
      const result = response.data
      if (response.success) {
        toast.success('Custom Page Successfully')
        navigate('/custom-page')
      } else {
        toast.error(result?.message || result?.error || 'Failed to create profile')
      }
    } catch (error) {
      console.error(error)
      toast.error(`${error?.error || 'Error creating page'}`)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //   height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '18px 5px',
      }}
    >
      {loading && <LoadingSpinner />}
      <div
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
          width: '60%',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Profile</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginLeft: '5px' }}
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
              style={{ width: '100%', padding: '8px', marginLeft: '5px' }}
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
              style={{ width: '100%', padding: '8px', marginLeft: '5px' }}
            />
          </div>

          {/* <div style={{ marginBottom: '10px' }}>
            <label>HTML</label>
            <input
              type="file"
              name="html"
              onChange={handleFileChange}
              required
              style={{ width: '100%', padding: '8px', marginLeft: '5px' }}
            />
          </div> */}
          <div style={{ marginBottom: '10px' }}>
            <label>HTML</label>
            <textarea
              type="string"
              name="html"
              onChange={handleChange}
              required
              style={{ height: "10rem", width: '100%', padding: '8px', marginLeft: '5px' }}
            />
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
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCustomPage
