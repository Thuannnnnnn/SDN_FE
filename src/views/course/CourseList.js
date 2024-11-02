import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CModalFooter,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CImage,
} from '@coreui/react'
import { ClassicEditor, Bold, Essentials, Italic, Paragraph } from 'ckeditor5'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import 'ckeditor5/ckeditor5.css'
import axios from 'axios'
import ReactLoading from 'react-loading'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { CSmartTable } from '@coreui/react-pro'
export default function CourseList() {
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [currentCourse, setCurrentCourse] = useState(null)
  const [posterLink, setPosterLink] = useState(null)
  const [videoIntro, setVideoIntro] = useState(null)
  const [posterLinkUrl, setPosterLinkUrl] = useState(null)
  const [videoIntroUrl, setVideoIntroUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAddOptions, setShowAddOptions] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    document.title = 'List Course'
  }, [])

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
  }, [])
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8080/api/course/getAll', {
          headers: { Authorization: token },
        })
        .then((response) => {
          console.log(response.data)
          setData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [token])

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0])
  }

  const handleEditClick = (course) => {
    setVideoIntroUrl(course.videoIntro)
    setPosterLinkUrl(course.posterLink)
    setCurrentCourse(course)
    setVisible(true)
  }

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId)
    setConfirmVisible(true)
  }

  const confirmDelete = () => {
    if (!courseToDelete) return

    if (token) {
      axios
        .delete(`http://localhost:8080/api/course/delete/${courseToDelete}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          setData((prevData) => prevData.filter((course) => course.courseId !== courseToDelete))
          setConfirmVisible(false)
          setCourseToDelete(null)
        })
        .catch((error) => {
          console.log(error)
          setConfirmVisible(false)
          setCourseToDelete(null)
        })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let videoUrl = videoIntroUrl
      let posterUrl = posterLinkUrl
      if (token) {
        if (videoIntro) {
          const videoFormData = new FormData()
          videoFormData.append('file', videoIntro)
          const fileNameVideoIntro = videoIntroUrl.substring(videoIntroUrl.lastIndexOf('/') + 1)
          const videoResponse = await axios.put(
            `http://localhost:8080/api/upload/update_video/${fileNameVideoIntro}`,
            videoFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
              },
            },
          )
          videoUrl = videoResponse.data.fileUrl
        }
        if (posterLink) {
          const posterFormData = new FormData()
          posterFormData.append('file', posterLink)
          const fileNamePosterLinkUrl = posterLinkUrl.substring(posterLinkUrl.lastIndexOf('/') + 1)
          const posterResponse = await axios.put(
            `http://localhost:8080/api/upload/update_image/${fileNamePosterLinkUrl}`,
            posterFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: token,
              },
            },
          )
          posterUrl = posterResponse.data.fileUrl
        }
        setCurrentCourse((prevCourse) => ({
          ...prevCourse,
          posterUrl: posterUrl,
          videoUrl: videoUrl,
        }))

        const courseFormData = new FormData()
        courseFormData.append('courseId', currentCourse.courseId)
        courseFormData.append('courseName', currentCourse.courseName)
        courseFormData.append('description', currentCourse.description)
        courseFormData.append('posterLink', posterUrl)
        courseFormData.append('videoIntro', videoUrl)
        courseFormData.append('price', currentCourse.price)
        courseFormData.append('category', currentCourse.category)
        courseFormData.append('userGenerated', currentCourse.userGenerated)

        await axios.put('http://localhost:8080/api/course/updateCourse', courseFormData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        })

        alert('Course updated successfully!')
        setVisible(false)
        axios
          .get('http://localhost:8080/api/course/getAll', {
            headers: { Authorization: token },
          })
          .then((response) => {
            setData(response.data)
          })
      }
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Error updating course, please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCurrentCourse((prevCourse) => ({ ...prevCourse, [name]: value }))
  }

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData()
    setCurrentCourse((prevCourse) => ({ ...prevCourse, description: data }))
  }

  const navigate = useNavigate()

  const handleShowContent = (course) => {
    navigate(`/content`, { state: { courseId: course.courseId, contents: course.contents } })
  }

  const columns = [
    { key: 'courseId', label: 'Course ID', _style: { width: '10%' } },
    { key: 'courseName', label: 'Course Name', _style: { width: '25%' } },
    {
      key: 'posterLink',
      label: 'Poster',
      _style: { width: '5%' },
      filter: false,
      sorter: false,
    },
    { key: 'price', label: 'Price', _style: { width: '10%' } },
    { key: 'category', label: 'Category', _style: { width: '20%' } },
    {
      key: 'actions',
      label: 'Actions',
      filter: false,
      _style: { width: '25%', height: '100%' },
      sorter: false,
    },
  ]
  return (
    <>
      <CSmartTable
        columns={columns}
        columnFilter
        items={data}
        itemsPerPageSelect
        itemsPerPage={5}
        columnSorter
        tableProps={{
          striped: true,
          hover: true,
          responsive: true,
        }}
        scopedColumns={{
          posterLink: (item) => (
            <td>
              <CImage src={`${item.posterLink}`} width={'100%'} />
            </td>
          ),
          actions: (course) => (
            <td
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <>
                <CButton
                  color="success"
                  onClick={() => handleEditClick(course)}
                  style={{ marginRight: '5px' }}
                  shape="rounded-pill"
                >
                  Edit
                </CButton>
                <CButton
                  color="danger"
                  onClick={() => handleDeleteClick(course.courseId)}
                  style={{ marginRight: '5px' }}
                  shape="rounded-pill"
                >
                  Delete
                </CButton>
                <CButton
                  as="a"
                  color="warning"
                  onClick={() => handleShowContent(course)}
                  shape="rounded-pill"
                >
                  Add content
                </CButton>
              </>
            </td>
          ),
        }}
        sorterValue={{ column: 'status', state: 'asc' }}
        pagination
      />

      {/* Add Content Modal */}
      {showAddOptions && (
        <CModal visible={showAddOptions} onClose={() => setShowAddOptions(false)}>
          <CModalHeader>
            <CModalTitle>Select Content Type</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CButton color="info">Add Video</CButton> <CButton color="info">Add Docs</CButton>{' '}
            <CButton color="info">Add Quiz</CButton>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowAddOptions(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* Edit Modal */}
      {currentCourse && (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Edit Course</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CInputGroup className="mb-3">
                <CInputGroupText>Course ID</CInputGroupText>
                <CFormInput id="courseId" name="courseId" value={currentCourse.courseId} disabled />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Course Name</CInputGroupText>
                <CFormInput
                  id="courseName"
                  name="courseName"
                  value={currentCourse.courseName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Course Video Intro</CInputGroupText>
                <CFormInput
                  type="file"
                  onChange={(e) => handleFileChange(e, setVideoIntro)}
                  disabled={loading}
                  placeholder={currentCourse.videoIntro}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Course Poster</CInputGroupText>
                <CFormInput
                  type="file"
                  onChange={(e) => handleFileChange(e, setPosterLink)}
                  disabled={loading}
                  placeholder={currentCourse.posterLink}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CInputGroupText>Price</CInputGroupText>
                <CFormInput
                  id="price"
                  name="price"
                  type="number"
                  value={currentCourse.price}
                  onChange={handleChange}
                  disabled={loading}
                />
              </CInputGroup>

              <CInputGroup className="mb-3">
                <CFormSelect
                  aria-label="Select Category"
                  name="category"
                  value={currentCourse.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select category</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  {/* Add other categories */}
                </CFormSelect>
              </CInputGroup>

              <div className="mb-3">
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    plugins: [Essentials, Paragraph, Bold, Italic],
                    toolbar: ['bold', 'italic'],
                  }}
                  data={currentCourse.description}
                  onChange={handleDescriptionChange}
                  disabled={loading}
                />
              </div>
            </CModalBody>
            <CModalFooter>
              {loading ? (
                <ReactLoading type="spin" color="#000" />
              ) : (
                <>
                  <CButton color="secondary" onClick={() => setVisible(false)}>
                    Cancel
                  </CButton>
                  <CButton color="primary" type="submit">
                    Save Changes
                  </CButton>
                </>
              )}
            </CModalFooter>
          </CForm>
        </CModal>
      )}

      {/* Confirm Delete Modal */}
      {confirmVisible && (
        <CModal visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
          <CModalHeader>
            <CModalTitle>Confirm Delete</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to delete this course? This action cannot be undone.
          </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={confirmDelete}>
              Yes, delete
            </CButton>{' '}
            <CButton color="secondary" onClick={() => setConfirmVisible(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      )}
      <CButton color="info" classname="w-100">
        <a href="/#/course_add" className="text-decoration-none text-reset">
          {' '}
          Add course{' '}
        </a>
      </CButton>
    </>
  )
}
