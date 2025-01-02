import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibCreativeCommonsSampling,
  cilBell,
  cilBook,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilList,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilUserFemale,
  cilUserPlus,
  cilUserX,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const navigation = [
  {
    component: CNavItem,
    name: 'Tổng quan',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component:CNavGroup,
    name:'Người dùng',
    to:'/users',
    icon:<CIcon icon={cilUser} customClassName="nav-icon"/>,
    items:[
      {
        component:CNavItem,
        name:'Danh sách',
        to:'/users/list'
      },
      {
        component:CNavItem,
        name:'Thống kê',
        to:'/users/statistic'
      }
    ]
  },
  {
    component:CNavGroup,
    name:'Sách',
    to:'/books',
    icon:<CIcon icon={cilBook} customClassName="nav-icon"/>,
    items:[
      {
        component:CNavItem,
        name:'Danh sách',
        to:'/books/list'
      },
      {
        component:CNavItem,
        name:'Thêm mới',
        to:'/books/add'
      },
      {
        component:CNavItem,
        name:'Thống kê',
        to:'/books/statistic'
      }
    ]
  },
  {
    component:CNavGroup,
    name:'Thể loại',
    to:'/genres',
    icon:<CIcon icon={cilNotes} customClassName="nav-icon"/>,
    items:[
      {
        component:CNavItem,
        name:'Danh sách',
        to:'/genres/list'
      },
      // {
      //   component:CNavItem,
      //   name:'Thêm mới',
      //   to:'/genres/add'
      // },
    ]
  },
  {
    component:CNavGroup,
    name:'Khoa',
    to:'/majors',
    icon:<CIcon icon={cilPencil} customClassName="nav-icon"/>,
    items:[
      {
        component:CNavItem,
        name:'Danh sách',
        to:'/majors/list'
      },
      //{
      //   component:CNavItem,
      //   name:'Thêm mới',
      //   to:'/majors/add'
      // },
    ]
  },
  {
    component:CNavGroup,
    name:'Thông báo',
    to:'/notifications',
    icon:<CIcon icon={cilBell} customClassName="nav-icon"/>,
    items:[
      {
        component:CNavItem,
        name:'Danh sách',
        to:'/notifications/list',
      },
      {
        component:CNavItem,
        name:'Thêm mới',
        to:'/notifications/add'
      },
    ]
  }
]

export default navigation
