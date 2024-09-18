import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const course = React.lazy(() => import('./views/course/CourseList'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/course', name: 'course', element: course },
]

export default routes
