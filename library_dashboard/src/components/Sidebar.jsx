import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CButton,
  CCloseButton,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import navigation from '../routers/navigation'
import SidebarNav from './SidebarNav'

import logo_iuh from '../assets/images/logo_iuh.png'
import { set } from '../redux/appSlice'
import CIcon from '@coreui/icons-react'
import { cilPhone } from '@coreui/icons'

const Sidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.app.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.app.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(set({ sidebarShow: visible }))
      }}
    >
      <CSidebarHeader className="border-bottom">
        <img src={logo_iuh} alt="logo" width={150} />
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch(set({ sidebarShow: false }))}
        />
      </CSidebarHeader>
      <SidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        {/* <CButton color="primary" variant="ghost" size="sm">
          <span className="me-2">Hỗ trợ</span>
          <CIcon icon={cilPhone} />
        </CButton> */}
      </CSidebarFooter>
    </CSidebar>
  )
}

export default memo(Sidebar)
