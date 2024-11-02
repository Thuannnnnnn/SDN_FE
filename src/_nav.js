import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilDrop, cilSpeedometer, cilCalculator, cilCalendarCheck } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Course',
    to: '/course',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    color: 'info',
  },
  {
    component: CNavItem,
    name: 'Order History',
    to: '/OrderHistory',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Score',
    to: '/score',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    color: 'info',
  },
]

export default _nav
