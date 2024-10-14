import React, { useState, useEffect } from 'react'
import {
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
} from '@coreui/react'
import { ClassicEditor, Bold, Essentials, Italic, Paragraph, ContextWatchdog } from 'ckeditor5'
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react'
import 'ckeditor5/ckeditor5.css'
import axios from 'axios'
import ReactLoading from 'react-loading'
import Cookies from 'js-cookie'
export default function CourseAdd() {
  const [courseName, setCourseName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [posterLink, setPosterLink] = useState(null)
  const [videoIntro, setVideoIntro] = useState(null)
  const [description, setDescription] = useState('')
  const [userGenerated] = useState('currentUser')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [errors, setErrors] = useState({
    courseName: '',
    price: '',
    category: '',
    videoIntro: '',
    posterLink: '',
  })

  useEffect(() => {
    document.title = 'Add Course'
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
  }, [])
  const handleFileChange = (e, setter) => {
    setter(e.target.files[0])
  }

  const validate = () => {
    const newErrors = {}
    if (!courseName) newErrors.courseName = 'Course name is required'
    if (!price || isNaN(price)) newErrors.price = 'Valid price is required'
    if (!category) newErrors.category = 'Category is required'
    if (!videoIntro) newErrors.videoIntro = 'Video intro is required'
    if (!posterLink) newErrors.posterLink = 'Poster is required'
    setErrors(newErrors)
    setLoading(false)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      return
    }
    setLoading(true)

    try {
      const videoFormData = new FormData()
      videoFormData.append('file', videoIntro)
      const videoResponse = await axios.post(
        'http://localhost:8080/api/upload/upload_video',
        videoFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        },
      )
      const videoUrl = videoResponse.data.fileUrl

      // Upload poster image
      const posterFormData = new FormData()
      posterFormData.append('file', posterLink)
      const posterResponse = await axios.post(
        'http://localhost:8080/api/upload/upload_image',
        posterFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        },
      )
      const posterUrl = posterResponse.data.fileUrl

      // Submit course data
      const courseFormData = new FormData()
      courseFormData.append('courseName', courseName)
      courseFormData.append('description', description)
      courseFormData.append('posterLink', posterUrl)
      courseFormData.append('videoIntro', videoUrl)
      courseFormData.append('price', price)
      courseFormData.append('category', category)
      courseFormData.append('userGenerated', userGenerated)
      courseFormData.append('contents', [])
      await axios.post('http://localhost:8080/api/course/createCourse', courseFormData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })

      alert('Course added successfully!')
    } catch (error) {
      console.error('Error adding course:', error)
      alert('Error adding course, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="Course" className="card-title mb-3">
                Add Course
              </h4>
            </CCol>
          </CRow>
          <CRow>
            <CInputGroup className="mb-3">
              <CInputGroupText>Course Name</CInputGroupText>
              <CFormInput
                placeholder="Enter Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                disabled={loading}
              />
              {errors.courseName && <div className="text-danger small">{errors.courseName}</div>}
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Course Price</CInputGroupText>
              <CFormInput
                placeholder="Course Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
              />
              {errors.price && <div className="text-danger small">{errors.price}</div>}
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Course Video Intro</CInputGroupText>
              <CFormInput
                type="file"
                onChange={(e) => handleFileChange(e, setVideoIntro)}
                disabled={loading}
              />
              {errors.videoIntro && <div className="text-danger small">{errors.videoIntro}</div>}
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CInputGroupText>Course Poster</CInputGroupText>
              <CFormInput
                type="file"
                onChange={(e) => handleFileChange(e, setPosterLink)}
                disabled={loading}
              />
              {errors.posterLink && <div className="text-danger small">{errors.posterLink}</div>}
            </CInputGroup>

            <CInputGroup className="mb-3">
              <CFormSelect
                aria-label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  'Open this select category',
                  { label: 'Information Technology', value: 'Information Technology' },
                  { label: 'Economy', value: 'Economy' },
                  { label: 'Digital Marketing', value: 'Digital Marketing' },
                ]}
                disabled={loading}
              />
              {errors.category && <div className="text-danger small">{errors.category}</div>}
            </CInputGroup>

            <CInputGroup>
              <CKEditorContext contextWatchdog={ContextWatchdog}>
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    plugins: [Essentials, Bold, Italic, Paragraph],
                    toolbar: ['undo', 'redo', '|', 'bold', 'italic'],
                  }}
                  data={description}
                  onChange={(event, editor) => {
                    setDescription(editor.getData())
                  }}
                  disabled={loading}
                />
              </CKEditorContext>
            </CInputGroup>
            {loading && (
              <div className="text-center">
                <ReactLoading type="spin" color="#000" height={50} width={50} />{' '}
                {/* Spinning loader */}
              </div>
            )}
            <CRow className="mt-3">
              <CCol>
                <button onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
              </CCol>
            </CRow>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}
