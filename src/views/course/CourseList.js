import React from 'react'

import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
const CourseList = () => {
  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="Course" className="card-title mb-0">
                Course
              </h4>
            </CCol>
          </CRow>
          <CRow></CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CourseList
