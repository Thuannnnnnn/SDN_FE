// src/routes/index.js
import React from 'react'

const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))
const Widgets = React.lazy(() => import('../views/widgets/Widgets'))
const Course = React.lazy(() => import('../views/course/CourseList'))
const CourseAdd = React.lazy(() => import('../views/course/CourseAdd'))

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, auth: true },
  { path: '/widgets', name: 'Widgets', element: Widgets, auth: true },
  { path: '/course', name: 'Course', element: Course, auth: true },
  { path: '/course_add', name: 'Course', element: CourseAdd },
]

export default routes
