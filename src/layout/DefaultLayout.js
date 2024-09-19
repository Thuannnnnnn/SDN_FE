import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'
import Cookies from 'js-cookie'

const DefaultLayout = () => {
  const [token, setToken] = useState(null)
  useEffect(() => {
    setToken(Cookies.get('token'))
  }, [token])

  return (
    <div>
      {token ? <AppSidebar /> : null}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        {token ? <AppHeader /> : null}
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
