import React from 'react'

const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'))

const Users = React.lazy(() => import('../pages/user/Users'))
const StatisticUser = React.lazy(() => import('../pages/user/StatisticUser'))

const Books = React.lazy(() => import('../pages/book/Books'))
const AddBook = React.lazy(() => import('../pages/book/AddBook'))
const AddChapter = React.lazy(() => import('../pages/book/AddChapter'))
const EditBook = React.lazy(() => import('../pages/book/EditBook'))
const StatisticBook = React.lazy(() => import('../pages/book/StatisticBook'))
const BookDetail = React.lazy(() => import('../pages/book/BookDetail'))

const Genres = React.lazy(() => import('../pages/genre/Genres'))
const AddGenre = React.lazy(() => import('../pages/genre/AddGenre'))

const Majors = React.lazy(() => import('../pages/majors/Majors'))
const AddMajor = React.lazy(() => import('../pages/majors/AddMajors'))

const Notifications = React.lazy(() => import('../pages/notification/Notifications'))
const AddNotification = React.lazy(() => import('../pages/notification/AddNotification'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Tổng quan', element: Dashboard },
  {path: '/users/list', name: 'Người dùng', element: Users},
  {path:'/users/statistic', name:'Thống kê người dùng', element: StatisticUser},
  {path:'/books/list', name:'Sách', element: Books},
  {path:'/books/add', name:'Thêm sách', element: AddBook},
  {path:'/books/add-chapter', name:'Thêm chương', element: AddChapter},
  {path:'/books/edit', name:'Sửa sách', element: EditBook},
  {path:'/books/statistic', name:'Thống kê sách', element: StatisticBook},
  {path:'/books/detail', name:'Chi tiết sách', element: BookDetail},
  {path:'/genres/list', name:'Thể loại', element: Genres},
  {path:'/genres/add', name:'Thêm thể loại', element: AddGenre},
  {path:'/majors/list', name:'Khoa', element: Majors},
  {path:'/majors/add', name:'Thêm ngành học', element: AddMajor},
  {path:'/notifications/list', name:'Thông báo', element: Notifications},
  {path:'/notifications/add', name:'Thêm thông báo', element: AddNotification},

]

export default routes
