import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CAlert,
} from '@coreui/react'

const ContentPage = () => {
  const location = useLocation()
  const { contents, courseId } = location.state || {} // Nhận courseId từ state

  // State cho modal và nội dung mới
  const [modalVisible, setModalVisible] = useState(false)
  const [newContent, setNewContent] = useState({ contentName: '', contentType: '' })
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [contentList, setContentList] = useState(contents || []) // Quản lý danh sách nội dung

  const handleAddContent = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/content/createContent',
        { ...newContent, courseId }, // Gửi courseId cùng với nội dung mới
      )
      console.log('Content created:', response.data)
      setAlertMessage('New content added successfully!')
      setAlertVisible(true)
      setModalVisible(false)
      setNewContent({ contentName: '', contentType: '' })
      setContentList((prev) => [...prev, response.data]) // Cập nhật danh sách nội dung
    } catch (error) {
      console.error('Error creating content:', error)
      setAlertMessage('Failed to add content.')
      setAlertVisible(true)
    }
  }

  const handleDeleteContent = async (contentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/content/deleteContent?contentId=${contentId}&courseId=${courseId}`, // Thêm courseId vào query
      )
      console.log('Content deleted:', response.data)
      setAlertMessage('Content deleted successfully!')
      setAlertVisible(true)
      setContentList((prevContents) =>
        prevContents.filter((content) => content.contentId !== contentId),
      ) // Cập nhật danh sách nội dung
    } catch (error) {
      console.error('Error deleting content:', error)
      setAlertMessage('Failed to delete content.')
      setAlertVisible(true)
    }
  }

  const handleUpdateContent = async (contentId) => {
    try {
      const updatedContent = {
        contentName: '',
        contentRef: '',
        contentType: '',
        courseId,
      }
      console.log('Updating content with:', updatedContent)

      const response = await axios.put(`http://localhost:8080/api/content/updateContent`, {
        contentId,
        ...updatedContent,
      })
      console.log('Content updated:', response.data)
      setAlertMessage('Content updated successfully!')
      setAlertVisible(true)
    } catch (error) {
      console.error('Error updating content:', error)
      setAlertMessage('Failed to update content.')
      setAlertVisible(true)
    }
  }

  return (
    <div>
      <h1>Content List</h1>
      {contentList.length > 0 ? (
        contentList.map((content) => (
          <CCard key={content.contentId} className="mb-3">
            <CCardHeader>
              <strong>{content.contentName}</strong>
              <div className="float-right">
                <CButton
                  color="warning"
                  onClick={() =>
                    handleUpdateContent(content.contentId, {
                      contentName: 'Updated Name',
                      contentType: content.contentType,
                    })
                  }
                >
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => handleDeleteContent(content.contentId)}>
                  Delete
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <p>Content Type: {content.contentType}</p>
            </CCardBody>
          </CCard>
        ))
      ) : (
        <p>No content available</p>
      )}
      <CButton color="primary" onClick={() => setModalVisible(true)}>
        Add Content
      </CButton>

      <CModal show={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Add New Content</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="contentName">Content Name</CFormLabel>
            <CFormInput
              id="contentName"
              value={newContent.contentName}
              onChange={(e) => setNewContent({ ...newContent, contentName: e.target.value })}
            />
            <CFormLabel htmlFor="contentType">Content Type</CFormLabel>
            <CFormInput
              id="contentType"
              value={newContent.contentType}
              onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddContent}>
            Add Content
          </CButton>
        </CModalFooter>
      </CModal>

      <CAlert
        color="success"
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        dismissible
      >
        {alertMessage}
      </CAlert>
    </div>
  )
}

export default ContentPage
