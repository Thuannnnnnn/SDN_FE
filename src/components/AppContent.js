// src/components/AppContent.js
import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import Cookies from 'js-cookie'
import routes from '../routes/routes'
import publicRoutes from '../routes/publicRoutes'

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const token = Cookies.get('token')
    setIsAuthenticated(!!token)
  }, [])

  if (isAuthenticated === null) {
    // Đang tải trạng thái xác thực
    return <CSpinner color="primary" />
  }

  const publicRouteElements = publicRoutes.map((route, idx) => {
    if (isAuthenticated) {
      return <Route key={idx} path={route.path} element={<Navigate to="/dashboard" replace />} />
    } else {
      return <Route key={idx} path={route.path} element={<route.element />} />
    }
  })

  const protectedRouteElements = routes.map((route, idx) => {
    if (isAuthenticated) {
      return <Route key={idx} path={route.path} element={<route.element />} />
    } else {
      return <Route key={idx} path={route.path} element={<Navigate to="/login" replace />} />
    }
  })

  return (
    <CContainer lg>
      <Routes>
        {publicRouteElements}
        {protectedRouteElements}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </CContainer>
  )
}

export default React.memo(AppContent)
