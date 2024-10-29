import React, { useEffect, useState } from 'react'
import { CCollapse, CCardBody, CButton, CBadge } from '@coreui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { CSmartTable } from '@coreui/react-pro'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function ScoreList() {
  const [details, setDetails] = useState([])
  const [data, setData] = useState([])
  const [token, setToken] = useState(null)

  useEffect(() => {
    document.title = 'List Score'
  }, [])

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token')
    setToken(tokenFromCookie ? `Bearer ${tokenFromCookie}` : null)
  }, [])

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Score')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'Score.xlsx')
  }

  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:8080/api/exams/resultAll/getAll', {
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
    {
      key: 'userEmail',
      label: 'Email',
      _style: { width: '20%' },
    },
    {
      key: 'courseId',
      label: 'Course',
      _style: { width: '30%' },
    },
    {
      key: 'score',
      label: 'Score',
      _style: { width: '20%' },
    },
    {
      key: 'passed',
      label: 'Status',
      _style: { width: '15%' },
      sorter: false,
    },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      filter: false,
      sorter: false,
    },
  ]

  const getBadge = (passed) => {
    return passed ? 'success' : 'danger'
  }

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  return (
    <>
      <button
        onClick={exportToExcel}
        style={{
          right: 0,
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Export to Excel
      </button>
      <CSmartTable
        columns={columns}
        columnFilter
        columnSorter
        items={data}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        onFilteredItemsChange={(items) => {
          console.log(items)
        }}
        onSelectedItemsChange={(items) => {
          console.log(items)
        }}
        scopedColumns={{
          userEmail: (item) => {
            return <td>{item.userEmail}</td>
          },
          courseId: (item) => {
            return <td>{item.courseId}</td>
          },
          score: (item) => {
            return <td>{item.score}</td>
          },
          passed: (item) => (
            <td>
              <CBadge color={getBadge(item.passed)}>{item.passed ? 'Passed' : 'Failed'}</CBadge>
            </td>
          ),
          show_details: (item) => {
            return (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    toggleDetails(item._id)
                  }}
                >
                  {details.includes(item._id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            )
          },
          details: (item) => {
            return (
              <CCollapse visible={details.includes(item._id)}>
                <CCardBody className="p-3">
                  <h4>{item.userEmail}</h4>
                  <p className="text-body-secondary">
                    {' '}
                    Attempted on: {new Date(item.attemptDate).toLocaleString()}
                  </p>
                  <CButton size="sm" color="info">
                    User Settings
                  </CButton>
                  <CButton size="sm" color="danger" className="ms-1">
                    Delete
                  </CButton>
                </CCardBody>
              </CCollapse>
            )
          },
        }}
        sorterValue={{ column: 'status', state: 'asc' }}
        tableProps={{
          className: 'add-this-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />
    </>
  )
}
