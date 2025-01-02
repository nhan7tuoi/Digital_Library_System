import React, { useEffect, useState } from 'react'
import { Button, Col, ConfigProvider, notification, Pagination, Popconfirm, Space, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { _deleteBook, _getBook } from './apis';
import { CCol, CRow } from '@coreui/react';
import Search from 'antd/es/transfer/search';
import viVN from 'antd/lib/locale/vi_VN';
import { useSelector } from 'react-redux';


const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const theme = useSelector((state) => state.app.theme);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [themeTokens, setThemeTokens] = useState({
    colorBgContainer: '#ffffff',
    colorText: '#000000',
    colorBorder: '#d9d9d9'
  });
  const [api, contextHolder] = notification.useNotification();


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
    fetchData(page, 5, keyword);
  }, [page,keyword])

  const columns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Thể loại',
      key: 'genre',
      render: (text, record) => (
        <span>
          {record.genre}
        </span>
      )
    },
    {
      title: 'Số trang',
      dataIndex: 'pageNumber',
      key: 'pageNumber',
    },
    {
      title: 'Khoa',
      key: 'majors',
      render: (text, record) => (
        <span>
          {record.majors}
        </span>
      )
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button
          onClick={()=>{
            navigate(`/books/detail`,{
              state: {
                data: {
                  bookId: record._id,
                }
              }
            })
          }}
          type="primary">Xem</Button>

          <Button onClick={()=>{
            navigate(`/books/edit`,{
              state: {
                data: {
                  bookId: record._id,
                  pdfLink: record.pdfLink,
                }
              }
            })
          }} >Sửa</Button>
          <Popconfirm
    title="Xoá sách"
    description="Bạn có chắc chắn muốn xóa sách này không?"
    onConfirm={()=>{
      confirm(record._id);
    }}
    onCancel={cancel}
    okText="Có"
    cancelText="Không"
  >
    <Button danger>Xoá</Button>
  </Popconfirm>
        </Space>
      ),
    }
  ];

  const confirm = (e) => {
    console.log(e);
    handleDelete(e);
  };
  const cancel = (e) => {
    console.log(e);
  };

  const handlePageChange = (page) => {
    fetchData(page, 5, keyword);
  }

  const handleSearch = (keyword) => {
    setKeyword(keyword);
  }

  const fetchData = async (page, limit, keyword) => {
    setLoading(true);
    try {
      const response = await _getBook(
        page,
        limit,
        keyword
      )
      setBooks(response.data);
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
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

  const handleDelete = async (id) => {
    try {
      const response = await _deleteBook(id);
      if(response.data){
        openNotification(true,"Sách đã được xóa thành công!","Thành công")();
        fetchData(page, 5, keyword);
      }
    } catch (error) {
      openNotification(true,"Đã xảy ra lỗi khi xóa sách!","Lỗi")();
      console.log(error);
    }
  }



  return (
    <>
    {contextHolder}
    <ConfigProvider locale={viVN} theme={{token:themeTokens}}>
    <CRow>
    <CCol xs>
      <CCol style={{padding:20}}>
      <Search placeholder="Nhập từ khóa" onChange={(e) => handleSearch(e.target.value)} />
      </CCol>
      <Table title={()=>{
        return (
          <Col>
            <h3>Danh sách sách</h3>
          </Col>
        )
      }} 
      loading={loading} bordered  dataSource={books} columns={columns} pagination={false} />

      <CCol xs={12} md={12} style={{marginTop:20,marginBottom:10,justifyContent:'center',alignItems:'center'}}>
      <ConfigProvider locale={viVN}>  
      <Pagination pageSize={5} showQuickJumper defaultCurrent={pagination.page} total={pagination.total} onChange={handlePageChange} />
      </ConfigProvider>
      </CCol>

    </CCol>
  </CRow>
  </ConfigProvider>
  </>
  );
}

export default Books