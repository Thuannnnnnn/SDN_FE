import React, { useEffect, useState } from 'react'
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
  CFormInput,
  CFormLabel,
  CAlert,
} from '@coreui/react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Cookies from 'js-cookie'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ContentPage = () => {
  const location = useLocation()
  const { courseId } = location.state || {}
  const [modalVisible, setModalVisible] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [contentList, setContentList] = useState([])
  const [value, setValue] = useState(0)
  const [quizTabValue, setquizTabValue] = useState(0)
  const [lockedTab, setLockedTab] = useState(null)
  const [token, setToken] = useState(null)
  const [editingContent, setEditingContent] = useState(null)

  const [selectType, setSelectType] = useState('videos')
  // Track input states for Video and Docs tabs
  const [videoTitle, setVideoTitle] = useState('')
  const [quizTitle, setQuizTi] = useState('')
  const [docsTitle, setDocsTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [idForData, setIdForData] = useState('')
  const [blobName, setBlobName] = useState('')

  // Dữ liệu cho Quiz
  const [quizData, setquizData] = useState([])
  const handleQuizTabChenga = (event, newValue) => {
    setquizTabValue(newValue)
  }

  const handleGetContent = async () => {
    try {
      if (token) {
        const response = await axios.get(`http://localhost:8080/api/course/getById/${courseId}`, {
          headers: { Authorization: token },
        })
        console.log(response.data.course.contents)
        setContentList(response.data.course.contents)
      }
    } catch (error) {
      setAlertMessage('Failed to add content.')
      setAlertVisible(true)
    }
  }

  const handleTabChange = (event, newValue) => {
    if (lockedTab !== null && lockedTab !== newValue) {
      return
    }
    setValue(newValue)
  }
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleVideoInputChange = (e) => {
    setVideoTitle(e.target.value)
  }

  const handleExamInputChange = (e) => {
    setQuizTi(e.target.value)
  }

  const handleDocsInputChange = (e) => {
    setDocsTitle(e.target.value)
  }
  const saveToSessionStorage = () => {
    sessionStorage.setItem('quizData', JSON.stringify(quizData))
  }

  const handleAddQuestion = () => {
    if (validateQuestions()) {
      const updatedquizData = [
        ...quizData,
        {
          question: '',
          options: ['', '', '', ''],
          answer: -1,
        },
      ]
      setquizData(updatedquizData)
      saveToSessionStorage()
    }
  }

  const handleQuestionChange = (index, value) => {
    const updatedquizData = quizData.map((question, questionIndex) => {
      if (questionIndex === index) {
        return { ...question, question: value }
      }
      return question
    })
    setquizData(updatedquizData)
  }

  const handleAnswerChange = (questionIndex, optionsIndex, value) => {
    const updatedquizData = quizData.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        const updatedOptions = question.options.map((option, oIndex) => {
          if (oIndex === optionsIndex) {
            return value
          }
          return option
        })
        return { ...question, options: updatedOptions }
      }
      return question
    })
    setquizData(updatedquizData)
  }

  const validateQuestions = () => {
    for (let question of quizData) {
      if (!question.question.trim()) {
        setAlertMessage('Please fill in the current question before adding a new one.')
        setAlertVisible(true)
        return false
      }
      for (let option of question.options) {
        if (!option.trim()) {
          setAlertMessage('Please fill in all answers before adding a new question.')
          setAlertVisible(true)
          return false
        }
      }
    }
    return true
  }

  const handleCorrectAnswerChange = (questionIndex, optionsIndex) => {
    const updatedquizData = quizData.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        return { ...question, answer: optionsIndex }
      }
      return question
    })
    setquizData(updatedquizData)
  }

  const handleDeleteQuestion = (index) => {
    const updatedquizData = quizData.filter((_, i) => i !== index)
    setquizData(updatedquizData)
    sessionStorage.setItem('quizData', JSON.stringify(updatedquizData))
  }
  //edit content
  const handleEditContent = (content) => {
    setIsEditing(true)
    setEditingContent(content)
    setModalVisible(true)
    if (content.contentType === 'videos') {
      setVideoTitle(content.contentName)
      setIdForData(content.contentRef._id)
      setBlobName(content.contentRef.videoId)
      setValue(0)
    } else if (content.contentType === 'docs') {
      setDocsTitle(content.contentName)
      setIdForData(content.contentRef._id)
      setBlobName(content.contentRef.docsId)
      setValue(1)
    } else if (content.contentType === 'questions') {
      setQuizTi(content.contentName)
      console.log(content)
      const quiz = content.contentRef
      if (quiz) {
        const extractedQuizData = {
          _id: quiz._id,
          question: quiz.question,
          options: quiz.options,
          answer: quiz.answer,
        }
        setquizData([extractedQuizData])
      }

      setValue(2)
    }
  }
  //edit content
  const handleSaveContent = async () => {
    try {
      let title
      let updatedContent = {}
      if (value === 0) {
        title = videoTitle
        if (!selectedFile) {
          setAlertMessage('Please select a file to upload.')
          return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)
        await axios.put(`http://localhost:8080/api/upload/update_video/${blobName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        })
        updatedContent = { idForData }
      } else if (value === 1) {
        // Update docs content
        title = docsTitle
        if (!selectedFile) {
          setAlertMessage('Please select a file to upload.')
          return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)
        await axios.put(`http://localhost:8080/api/upload/update_docs/${blobName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        })
        updatedContent = { idForData }
      } else {
        title = quizTitle
        updatedContent = { quizData }
      }
      const response1 = await axios.put(
        `http://localhost:8080/api/content/updateContent`,
        {
          contentId: editingContent?.contentId,
          courseId: courseId,
          contentType: editingContent?.contentType,
          contentName: title,
          updatedContent,
        },
        {
          headers: { Authorization: token },
        },
      )
      console.log(response1)
      setAlertMessage('Content updated successfully!')
      setAlertVisible(true)
      setModalVisible(false)
    } catch (error) {
      setAlertMessage('Failed to update content.')
      setAlertVisible(true)
    }
  }

  const handleAddNewContent = () => {
    setIsEditing(false)
    setModalVisible(true)
    setVideoTitle('')
    setDocsTitle('')
    setQuizTi('')
    setquizData([])
  }
  //add to content
  const handleAddContent = async () => {
    try {
      setIsEditing(false)
      let title
      if (!(quizTitle || videoTitle || docsTitle)) {
        setAlertMessage('Please fill in the title of the quiz.')
      }
      let response
      let id
      if (selectType === 'docs') {
        title = docsTitle
        if (!selectedFile) {
          setAlertMessage('Please select a file to upload.')
          return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)

        response = await axios.post('http://localhost:8080/api/upload/upload_docs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        })
        id = response.data.newDocs._id
      }
      if (selectType === 'videos') {
        console.log('có vào đây không')
        console.log(videoTitle)
        title = videoTitle
        if (!selectedFile) {
          setAlertMessage('Please select a file to upload.')
          return
        }

        const formData = new FormData()
        formData.append('file', selectedFile)

        response = await axios.post('http://localhost:8080/api/upload/upload_video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          },
        })
        id = response.data.newVideo._id
      }
      if (selectType === 'questions') {
        title = quizTitle
        response = await axios.post(
          'http://localhost:8080/api/quizz/questions',
          {
            questions: quizData,
            contentId: contentList?.contentId,
          },
          {
            headers: { Authorization: token },
          },
        )
        id = response.data.data[0]._id
      }
      if (!id) {
        console.log('no id')
      }
      const response1 = await axios.post(
        'http://localhost:8080/api/content/createContent',
        {
          contentName: title,
          contentType: selectType,
          contentRef: id,
          courseId: courseId,
        },
        {
          headers: { Authorization: token },
        },
      )
      setAlertMessage('New content added successfully!')
      setAlertVisible(true)
      setModalVisible(false)
      setContentList((prev) => [...prev, response1.data.course])
      sessionStorage.removeItem('quizData')
    } catch (error) {
      setAlertMessage('Failed to add content.')
      setAlertVisible(true)
    }
  }
  // delete content
  const handleDeleteContent = async (id, contentRef, contentType) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/content/deleteContent`, {
        headers: { Authorization: token },
        data: {
          contentId: id,
          courseId: courseId,
          contentRef: contentRef,
          contentType,
        },
      })
      if (response.status === 200) {
        console.log('check ' + contentType)
        if (contentType === 'videos') {
          await axios.delete(
            `http://localhost:8080/api/upload/delete_video/${contentRef.videoId}`,
            {
              headers: { Authorization: token },
            },
          )
        } else if (contentType === 'docs') {
          await axios.delete(`http://localhost:8080/api/upload/delete_docs/${contentRef.docsId}`, {
            headers: { Authorization: token },
          })
        }
        setAlertMessage('Content deleted successfully!')
      } else {
        setAlertMessage('Failed to delete content.')
      }
      setAlertMessage('Content deleted successfully!')
    } catch (error) {
      setAlertMessage('Failed to delete content.')
      setAlertVisible(true)
    }
  }

  useEffect(() => {
    const checkIfTabShouldBeLocked = () => {
      if (videoTitle.trim() || quizTitle.trim() || docsTitle.trim() || quizData.length > 0) {
        if (videoTitle.trim()) setLockedTab(0)
        if (docsTitle.trim()) setLockedTab(1)
        if (quizTitle.trim()) setLockedTab(2)
        if (quizData.length > 0) setLockedTab(2)
      } else {
        setLockedTab(null)
      }
    }
    checkIfTabShouldBeLocked()
  }, [videoTitle, docsTitle, quizData, quizTitle])
  useEffect(() => {
    const storedquizData = sessionStorage.getItem('quizData')
    if (storedquizData) {
      setquizData(JSON.parse(storedquizData))
    }
  }, [])

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
    handleGetContent()
  }, [token])
  return (
    <div>
      <h1>Content List</h1>
      {contentList.length > 0 ? (
        contentList.flat().map((content) =>
          content ? (
            <CCard key={content?.contentId} className="mb-3">
              <CCardHeader>
                <strong>{content?.contentName}</strong>
                <div className="float-right">
                  <CButton color="warning" onClick={() => handleEditContent(content)}>
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    className="ms-2"
                    onClick={() =>
                      handleDeleteContent(
                        content?.contentId,
                        content?.contentRef,
                        content?.contentType,
                      )
                    }
                  >
                    Delete
                  </CButton>
                </div>
              </CCardHeader>
              <CCardBody>
                <p>Content Type: {content?.contentType}</p>
              </CCardBody>
            </CCard>
          ) : null,
        )
      ) : (
        <p>No content available</p>
      )}
      <CButton color="primary" onClick={handleAddNewContent}>
        Add Content
      </CButton>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{isEditing ? 'Edit Content' : 'Add Content'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
              }}
            >
              <Tabs
                value={value}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
              >
                <Tab
                  label="Video"
                  {...a11yProps(0)}
                  disabled={
                    (lockedTab !== null && lockedTab !== 0) ||
                    editingContent?.contentType === 'videos'
                  }
                  onClick={() => setSelectType('videos')}
                />
                <Tab
                  label="Docs"
                  {...a11yProps(1)}
                  disabled={
                    (lockedTab !== null && lockedTab !== 1) ||
                    editingContent?.contentType === 'docs'
                  }
                  onClick={() => setSelectType('docs')}
                />
                <Tab
                  label="Quiz"
                  {...a11yProps(3)}
                  disabled={
                    (lockedTab !== null && lockedTab !== 2) ||
                    editingContent?.contentType === 'questions'
                  }
                  onClick={() => setSelectType('questions')}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0} onChange={() => setLockedTab(0)}>
              <CFormInput
                type="text"
                placeholder="Title of video"
                aria-label="Video title"
                value={videoTitle}
                onChange={handleVideoInputChange}
              />
              <div className="mb-3">
                <CFormInput
                  type="file"
                  size="sm"
                  id="formFileSm"
                  label=" "
                  onChange={handleFileChange}
                />
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1} onChange={() => setLockedTab(1)}>
              <CFormInput
                type="text"
                placeholder="Title of Docs"
                aria-label="Docs title"
                value={docsTitle}
                onChange={handleDocsInputChange}
              />
              <div className="mb-3">
                <CFormInput
                  type="file"
                  size="sm"
                  id="formFileSm"
                  label=" "
                  onChange={handleFileChange}
                />
              </div>
            </CustomTabPanel>

            {/* Quiz input */}
            <CustomTabPanel value={value} index={2} onChange={() => setLockedTab(2)}>
              <CFormInput
                type="text"
                placeholder="Title of Exam"
                aria-label="Exam title"
                value={quizTitle}
                onChange={handleExamInputChange}
              />
              <Box
                sx={{
                  borderBottom: 0,
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignContent: 'center',
                }}
              >
                <Tabs
                  value={quizTabValue}
                  onChange={handleQuizTabChenga}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="Quiz tabs"
                >
                  <Tab label="Add Quiz" {...a11yProps(4)} />
                  <Tab label="Add File" {...a11yProps(5)} />
                </Tabs>
              </Box>

              {/* Panel for adding quiz */}
              <CustomTabPanel value={quizTabValue} index={0}>
                {quizData.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="mb-4"
                    style={{
                      border: '1px solib #000',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <CFormLabel className="me-2" style={{ fontStyle: 'oblique' }}>{`Question ${
                        questionIndex + 1
                      }`}</CFormLabel>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(questionIndex)}
                      >
                        Delete
                      </CButton>
                    </div>
                    <div className="d-flex "></div>
                    {/* Câu hỏi */}
                    <CFormInput
                      type="text"
                      placeholder={`Question ${questionIndex + 1}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                    />
                    {/* Danh sách các câu trả lời */}
                    {quizData[questionIndex] &&
                      Array.isArray(quizData[questionIndex].options) &&
                      quizData[questionIndex].options.map((option, optionsIndex) => (
                        <div
                          key={optionsIndex}
                          className="mb-2 mt-3"
                          style={{ justifyContent: 'space-around', alignContent: 'center' }}
                        >
                          <CFormLabel className="me-2" style={{ fontStyle: 'oblique' }}>{`Answer ${
                            optionsIndex + 1
                          }`}</CFormLabel>
                          <div className="d-flex ">
                            <CFormInput
                              type="text"
                              placeholder={`Answer ${optionsIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleAnswerChange(questionIndex, optionsIndex, e.target.value)
                              }
                            />
                            <div className="form-check ms-3" style={{ alignContent: 'center' }}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={quizData[questionIndex].answer === optionsIndex}
                                onChange={() =>
                                  handleCorrectAnswerChange(questionIndex, optionsIndex)
                                }
                              />
                              <CFormLabel className="form-check-label">Correct</CFormLabel>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
                <CButton color="primary" onClick={handleAddQuestion}>
                  Add Another Question
                </CButton>
              </CustomTabPanel>

              {/* Panel for adding file */}
              <CustomTabPanel value={quizTabValue} index={1}>
                <div className="mb-3">
                  <CFormInput type="file" size="sm" id="formFileSm" label="Import excel Quiz" />
                </div>
              </CustomTabPanel>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3} onChange={() => setLockedTab(3)}>
              <div className="mb-3">
                <CFormInput type="file" size="sm" id="formFileSm" label="Import excel Quiz" />
              </div>
            </CustomTabPanel>
          </Box>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={isEditing ? handleSaveContent : handleAddContent}>
            {isEditing ? 'Save Changes' : 'Add Content'}
          </CButton>
        </CModalFooter>
      </CModal>

      {alertVisible && (
        <CAlert color="success" onClose={() => setAlertVisible(false)} dismissible>
          {alertMessage}
        </CAlert>
      )}
    </div>
  )
}

export default ContentPage
