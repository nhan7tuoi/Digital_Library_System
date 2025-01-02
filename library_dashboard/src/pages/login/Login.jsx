import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import './styles.css'
import logo from '../../assets/images/logo_iuh.png'
import { _login } from './apis'
import { notification } from 'antd'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const handleLogin = async() => {
    try {
      const response = await _login({ email, password });
    if(response.data){
      console.log(response.data);
      if(response.data.role !== 'admin'){
        openNotification(true,"Bạn không có quyền truy cập!","Đăng nhập thất bại!")();
        return;
      }
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    }
    } catch (error) {
      openNotification(true,`${error.response.data.error.message}`,"Đăng nhập thất bại! ")();
    }
  }
  const openNotification = (pauseOnHover,description,title) => () => {
    api.open({
      message: title,
      description:description,
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <>
        {contextHolder}
    <div className="bg-blurred d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <div className="card-container">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                  <CRow className="justify-content-center">
                  <CImage className='logo' src={logo} fluid  />
                  </CRow>
                    <CForm>
                      <h1>Đăng nhập</h1>
                      <p className="text-body-secondary">Đăng nhập để tiếp tục</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput value={email} 
                        onChange={(text)=>{
                          setEmail(text.target.value);
                        }} placeholder="Email" autoComplete="username" />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                        value={password}
                        onChange={(text)=>{
                          setPassword(text.target.value);
                        }}
                          type="password"
                          placeholder="Mật khẩu"
                          autoComplete="current-password"
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton onClick={handleLogin} color="primary" className="px-4">
                            Đăng nhập
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Login
