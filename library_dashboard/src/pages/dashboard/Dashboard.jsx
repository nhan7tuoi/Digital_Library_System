import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import { _getMajors, _getUsers } from '../user/apis'
import { formatDate } from '../../utils'
import { CChartBar, CChartPie } from '@coreui/react-chartjs'
import { _getStatisticsDashBoard, _getStatisticsDashBoardUser } from './apis'
import { Table } from 'antd'

const Dashboard = () => {
  const [major, setMajor] = useState({
    name: 'Tất cả',
    _id: null,
  });
  const [majors, setMajors] = useState([]);
  const [statistic, setStatistic] = useState({});
  const [statisticUser, setStatisticUser] = useState({});

  useEffect(() => {
    getMajors();
    handleStatistic();
    handleStatisticUser();
  }, []);

  useEffect(() => {
    handleGetAllSatistic();
  }, [major]);


  const getMondayAndSundayFromAnyDay = (date) => {
    const currentDay = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); 

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); 

    return { monday, sunday };
};

const handleStatistic = async() => {
  try {
    const date = new Date();
  const { monday, sunday } = getMondayAndSundayFromAnyDay(date);
  const response = await _getStatisticsDashBoard({
    fromDate: monday,
    toDate: sunday,
  });
  if(response.data){
    setStatistic(response.data);
  }
  } catch (error) {
    console.log(error);
  }
}

const handleStatisticUser = async() => {
  try {
    const date = new Date();
  const { monday, sunday } = getMondayAndSundayFromAnyDay(date);
  const response = await _getStatisticsDashBoardUser({
    fromDate: monday,
    toDate: sunday,
  });
  if(response.data){
    console.log(response.data);
    setStatisticUser(response.data);
  }
  }
  catch (error) {
    console.log(error);
  }
}

const getMajors = async() => {
  try {
    const response = await _getMajors();
    if(response.data){
      setMajors(response.data);
    }
  } catch (error) {
    console.log(error);
    
  }
}

const handleGetAllSatistic = async() => {
  try {
        const date = new Date();
  const { monday, sunday } = getMondayAndSundayFromAnyDay(date);
    const response1 = await _getStatisticsDashBoard({
      fromDate: monday,
      toDate: sunday,
      majorsId: major.name === 'Tất cả' ? null : major._id,
    });
    if(response1.data){
      setStatistic(response1.data);
    }
    const response2 = await _getStatisticsDashBoardUser({
      fromDate: monday,
      toDate: sunday,
      majorsId: major.name === 'Tất cả' ? null : major._id,
    });
    if(response2.data){
      setStatisticUser(response2.data);
      console.log(response2.data);
    }
  } catch (error) {
    console.log(error);
  }
}

const columns = [
  {
    key: "image",
    title: "Ảnh đại diện",
    dataIndex: "image",
    render: (value) => (
      <CAvatar src={value} size="md" />
    ),
  },
  {
    title: 'Họ và Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title:'Khoa',
    dataIndex: 'majors',
    key: 'majors',
  },
  {
    title:'Ngày sinh',
    dataIndex: 'dob',
    key: 'dob',
    render: (value) => formatDate(value),
  },
  {
    title:'Giới tính',
    dataIndex:'gender',
    key:'gender',
    render: (value) => value === 'Male' ? 'Nam' : 'Nữ',
  },
  {
    title:"Email",
    dataIndex:'email',
    key:'email',
  },
]

  return (
    <>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className='font-weight-bold h4'>Tóm tắt thống kê theo tuần hiện tại</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">
                          Lượt đọc mới
                          </div>
                        <div className="fs-5 fw-semibold">
                          {statistic?.totalViews}
                        </div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Lượt đánh giá mới
                        </div>
                        <div className="fs-5 fw-semibold">
                          {statistic?.totalReviews}
                        </div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                 <CChartBar
                 responsive
                 data ={
                  {
                    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                    datasets: [
                      {
                        label: 'Lượt đánh giá mới',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 2,
                        data: statistic?.listReviews?.map((item) => item.reviewCount),
                        
                        
                      },
                      {
                        label: 'Lượt đọc mới',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        data: statistic?.listViews?.map((item) => item.totalViews),
                      },
                    ],
                  }
                 }
                  options={{
                    tooltips: {
                      enabled: true,
                    },
                  }}
                />
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Người dùng mới</div>
                        <div className="fs-5 fw-semibold">
                          {statisticUser?.userList?.length}
                        </div>
                      </div>
                    </CCol>

                    <CCol xs={6}>
                      <CDropdown>
                        <CDropdownToggle className='bg-primary' style={{justifyItems:'center',alignItems:'center',borderRadius:20}} caret={false}>
                          <p style={{
                            paddingLeft: 10,
                            paddingRight: 10,
                            margin: 5,
                            fontSize: 18,
                            fontWeight: 500,
                            color: "white",
                          }}>{major.name}</p>
                        </CDropdownToggle>
                        <CDropdownMenu  className="overflow-auto" style={{ maxHeight: "300px" }}>
                          {majors.map((major, index) => (
                            <CDropdownItem onClick={()=>{
                              setMajor(major)
                            }} key={index}>{major.name}</CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                    <div className="progress-group mb-4" key={'nam'}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={cilUser} size="lg" />
                        <span>Nữ</span>
                        <span className="ms-auto fw-semibold">
                          {statisticUser.countFemale}
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={
                          (statisticUser.countFemale / (statisticUser.countMale + statisticUser.countFemale)) * 100
                        } />
                      </div>
                    </div>
                    <div className="progress-group mb-4" key={'nu'}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={cilUserFemale} size="lg" />
                        <span>Nam</span>
                        <span className="ms-auto fw-semibold">
                          {statisticUser.countMale}
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={
                          (statisticUser.countMale / (statisticUser.countFemale + statisticUser.countMale)) * 100
                        } />
                      </div>
                    </div>
                </CCol>
              </CRow>

              <br />
              <div className="text-center">
                  <p className="font-weight-bold h4">Danh sách người dùng mới</p>
              </div>
              <Table columns={columns} dataSource={statisticUser?.userList} pagination={{pageSize:5}} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
