// src/routes/index.js
import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Widgets = React.lazy(() => import('../views/widgets/Widgets'))
const Course = React.lazy(() => import('../views/course/CourseList'))
const Content = React.lazy(() => import('../views/content/ContentPage'))
const CourseAdd = React.lazy(() => import('../views/course/CourseAdd'))
const User = React.lazy(() => import('../views/users/user'))
const OrderHistory = React.lazy(() => import('../views/OrderHistory/OrderHistory'))
const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, auth: true },
  { path: '/widgets', name: 'Widgets', element: Widgets, auth: true },
  { path: '/course', name: 'Course', element: Course, auth: true },
  { path: '/course_add', name: 'Course', element: CourseAdd },
  { path: '/user', name: 'User', element: User },
  { path: '/content', name: 'Content', element: Content, auth: true },
  { path: '/OrderHistory', name: 'OrderHistory', element: OrderHistory, auth: true },
]

export default routes
