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

export default function OrderHistoryList() {
  const [data, setData] = useState([])
  const [token, setToken] = useState(null)

  // Set the document title on component mount
  useEffect(() => {
    document.title = 'Order History List'
  }, [])

  // Retrieve token from cookies
  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
  }, [])

  // Fetch the order history if token is available
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8080/api/order/getAll', {
          headers: { Authorization: token },
        })
        .then((response) => {
          setData(response.data)
        })
        .catch((error) => {
          console.error('Error fetching order history:', error)
        })
    }
  }, [token])

  return (
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Order ID</CTableHeaderCell>
          <CTableHeaderCell scope="col">User Email</CTableHeaderCell>
          <CTableHeaderCell scope="col">Price</CTableHeaderCell>
          <CTableHeaderCell scope="col">Courses</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.length > 0 ? (
          data.map((order) => (
            <CTableRow key={order.orderId}>
              <CTableDataCell>{order.orderId}</CTableDataCell>
              <CTableDataCell>{order.userEmail}</CTableDataCell>
              <CTableDataCell>{order.price} VND</CTableDataCell>
              <CTableDataCell>
                <ul>
                  {order.courses.map((course) => (
                    <li key={course.course ? course.course._id : Math.random()}>
                      Course ID: {course.courseName}, Purchased on:{' '}
                      {new Date(course.purchaseDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </CTableDataCell>
            </CTableRow>
          ))
        ) : (
          <CTableRow>
            <CTableDataCell colSpan="4" className="text-center">
              No order history available.
            </CTableDataCell>
          </CTableRow>
        )}
      </CTableBody>
    </CTable>
  )
}
