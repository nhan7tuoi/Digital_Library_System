import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { ConfigProvider } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/Layout'))

// Pages
const Login = React.lazy(() => import('./pages/login/Login'))
const Page404 = React.lazy(() => import('./pages/page404/Page404'))
const Page500 = React.lazy(() => import('./pages/page500/Page500'))

// Dashboard
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'))

// Users
const Users = React.lazy(() => import('./pages/user/Users'))
const StatisticUser = React.lazy(() => import('./pages/user/StatisticUser'))

// Books
const Books = React.lazy(() => import('./pages/book/Books'))

const AddBook = React.lazy(() => import('./pages/book/AddBook'))
const AddChapter = React.lazy(() => import('./pages/book/AddChapter'))
const EditBook = React.lazy(() => import('./pages/book/EditBook'))
const StatisticBook = React.lazy(() => import('./pages/book/StatisticBook'))
const BookDetail = React.lazy(() => import('./pages/book/BookDetail'))

// Genres
const Genres = React.lazy(() => import('./pages/genre/Genres'))
const AddGenre = React.lazy(() => import('./pages/genre/AddGenre'))

// Majors
const Majors = React.lazy(() => import('./pages/majors/Majors'))
const AddMajor = React.lazy(() => import('./pages/majors/AddMajors'))

// Notifications
const Notifications = React.lazy(() => import('./pages/notification/Notifications'))
const AddNotification = React.lazy(() => import('./pages/notification/AddNotification'))

import ProtectedRoute from './routers/ProtectedRoute'


const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme);
  const theme = useSelector((state) => state.app.theme);
  const [themeTokens, setThemeTokens] = useState({
    colorBgContainer: '#ffffff',
    colorText: '#000000',
    colorBorder: '#d9d9d9'
  });


  useEffect(() => {
    setThemeTokens(theme ==='dark' ? {
      colorBgContainer: '#212631',
      colorText: '#E2E3E4',
      colorBorder: '#434343'
    } : {
      colorBgContainer: '#ffffff',
      colorText: '#000000',
      colorBorder: '#d9d9d9'
    });
  }, [theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) 



  return (
    <ConfigProvider theme={{ token: themeTokens }} locale={viVN}>
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />

<Route element={<ProtectedRoute />}>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Dashboard />} /> 
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users/list" element={<Users />} />
            <Route path="users/statistic" element={<StatisticUser />} />
            <Route path="books/list" element={<Books />} />
            <Route path="books/add" element={<AddBook />} />
            <Route path="books/add-chapter" element={<AddChapter />} />
            <Route path="books/edit" element={<EditBook />} />
            <Route path="books/statistic" element={<StatisticBook />} />
            <Route path="books/detail" element={<BookDetail />} />
            <Route path="genres/list" element={<Genres />} />
            <Route path="genres/add" element={<AddGenre />} />
            <Route path="majors/list" element={<Majors />} />
            <Route path="majors/add" element={<AddMajor />} />
            <Route path="notifications/list" element={<Notifications />} />
            <Route path="notifications/add" element={<AddNotification />} />
          </Route>  
</Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </HashRouter>
    </ConfigProvider>
  )
}

export default App
