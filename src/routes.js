import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const courseList = React.lazy(() => import('./views/course/CourseList'))
const CourseAdd = React.lazy(() => import('./views/course/CourseAdd'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/course', name: 'Course', element: courseList },
  { path: '/course_add', name: 'Course', element: CourseAdd },
]

export default routes
