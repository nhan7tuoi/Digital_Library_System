import React, { useEffect, useState } from "react";
import { _banUser, _getUserPage, _getUsers } from "./apis";
import { Button, Col, ConfigProvider, Pagination, Popconfirm, Space, Table } from 'antd';
import { CCol, CRow, useColorModes } from "@coreui/react";
import Search from "antd/es/transfer/search";
import { formatDate } from "../../utils";
import viVN from 'antd/lib/locale/vi_VN';
import { useSelector } from "react-redux";




const Users = () => {
  const [users,setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
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

  const columns = [
    {
      key: "stt",
      title: "STT",
      dataIndex: "",
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title:'Mã sinh viên/giáo viên',
      dataIndex: 'code',
      key: 'code',
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
    {
      title:"Chức năng",
      render: (value, item) => (
        <Space>
          {item.status === "active" ? (
            <Popconfirm
            title="Bạn có chắc chắn muốn khóa tài khoản này?"
            onConfirm={() => handleToggleStatus(item._id, item.status)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>
              Khóa
            </Button>
          </Popconfirm>
          ) : (
            <Popconfirm
            title="Bạn có chắc chắn muốn mở khóa tài khoản này?"
            onConfirm={() => handleToggleStatus(item._id, item.status)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary">
              Mở khóa
            </Button>
          </Popconfirm>
          )}
        </Space>
      ),

    }
  ]
  
  useEffect(() => {
    fetchUser(page, 5, keyword);
  }, [page,keyword]);

  const fetchUser = async (page, limit, keyword) => {
    setLoading(true);
    const response = await _getUserPage(page, limit, keyword);
    if(response.data){
      console.log(response.data);
      setUsers(response.data);
      setPagination(response.pagination);
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await _banUser(userId);
    setUsers(users.map((u) => {
      if (u._id === userId) {
        return { ...u, status: currentStatus === "active" ? "banned" : "active" };
      }
      return u;
    }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  }

  const handleSearch = async (keyword) => {
    setKeyword(keyword);
  };


  return (
    <ConfigProvider theme={{ token: themeTokens }} locale={viVN}>
    <CRow>
      <CCol xs>
        <CCol style={{padding:20}}>
        <Search
         placeholder="Nhập từ khóa" onChange={(e) => handleSearch(e.target.value)} />
        </CCol>
        <Table 
        title={()=>{
          return (
            <Col>
              <h3>Danh sách người dùng</h3>
            </Col>
          )
        }} 
        loading={loading} bordered  dataSource={users} columns={columns} pagination={false} />

        <CCol xs={12} md={12} style={{marginTop:20,marginBottom:10,justifyContent:'center',alignItems:'center'}}>
        <Pagination showQuickJumper pageSize={5} defaultCurrent={pagination.page} total={pagination.total} onChange={handlePageChange} />
        </CCol>

      </CCol>
    </CRow>
    </ConfigProvider>
  );
};

export default Users;
