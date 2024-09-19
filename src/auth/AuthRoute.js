import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const AuthRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const token = Cookies.get('token') // Lấy token từ cookie
    const isLoggedIn = !!token // Kiểm tra xem token có tồn tại không
    setIsAuthenticated(isLoggedIn)
  }, []) // Chạy effect chỉ một lần khi component mount

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />
  }

  // Nếu chưa đăng nhập, chỉ cho phép vào trang login
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  return <Component {...rest} />
}

AuthRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
}

export default AuthRoute
