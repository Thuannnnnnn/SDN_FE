// src/routes/publicRoutes.js
import React from 'react'

const Login = React.lazy(() => import('../views/pages/login/Login'))

const publicRoutes = [{ path: '/login', name: 'Login', element: Login }]

export default publicRoutes
