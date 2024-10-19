import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableHead,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function UserList() {
  const [data, setData] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    document.title = 'List User'
  }, [])

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
  }, [])

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8080/api/user/getAllUser', {
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

  return (
    <>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Role</CTableHeaderCell>
            <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
            <CTableHeaderCell scope="col">Phone Number</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.map((user) => (
            <CTableRow key={user.email}>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{user.role}</CTableDataCell>
              <CTableDataCell>{user.gender}</CTableDataCell>
              <CTableDataCell>{user.phoneNumber}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}
