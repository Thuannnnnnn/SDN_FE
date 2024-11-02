import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { CSmartTable } from '@coreui/react-pro'

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

  const columns = [
    { key: 'email', label: 'Email', _style: { width: '25%' } },
    { key: 'name', label: 'Name', _style: { width: '25%' } },
    { key: 'role', label: 'Role', _style: { width: '20%' } },
    { key: 'gender', label: 'Gender', _style: { width: '15%' } },
    { key: 'phoneNumber', label: 'Phone Number', _style: { width: '15%' } },
  ]
  const renderValue = (value) => {
    return value ? value : 'NOT'
  }
  return (
    <CSmartTable
      columns={columns}
      items={data}
      columnFilter
      columnSorter
      itemsPerPageSelect
      itemsPerPage={5}
      pagination
      tableProps={{
        striped: true,
        hover: true,
        responsive: true,
      }}
      tableBodyProps={{
        className: 'align-middle',
      }}
      scopedColumns={{
        email: (item) => <td>{renderValue(item.email)}</td>,
        name: (item) => <td>{renderValue(item.name)}</td>,
        role: (item) => <td>{renderValue(item.role)}</td>,
        gender: (item) => <td>{renderValue(item.gender)}</td>,
        phoneNumber: (item) => <td>{renderValue(item.phoneNumber)}</td>,
      }}
    />
  )
}
