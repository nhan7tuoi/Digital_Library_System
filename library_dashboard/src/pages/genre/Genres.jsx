import { useEffect, useState } from "react";
import { _getGenres } from "../home/apis";
import { Button, Col, ConfigProvider, Space, Table } from "antd";
import { CCol } from "@coreui/react";
import Search from "antd/es/transfer/search";
import { useSelector } from "react-redux";

const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const column = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "id",
        },
        {
            title: "Tên thể loại",
            dataIndex: "name",
            key: "name",
        }
    ]

    useEffect(() => {
        getGenres();
    }, []);

    const getGenres = async () => {
        setLoading(true);
        try {
            const res = await _getGenres();
            if(res.data){
                setGenres(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleSearch = (value) => {
        if(value){
            const filter = genres.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
            setGenres(filter);
        } else {
            getGenres();
        }
    }
    
    return (
        <ConfigProvider theme={{ token: themeTokens }}>
        <div>
            <CCol style={{padding:20}}>
        <Search placeholder="Nhập từ khóa" onChange={(e) => handleSearch(e.target.value)} />
        </CCol>
            <Table title={()=>{
          return (
            <Col>
              <h3>Danh sách thể loại</h3>
            </Col>
          )
        }}  dataSource={genres} columns={column} loading={loading} rowKey="id" pagination={{pageSize:5}}/>
        </div>
        </ConfigProvider>
    );
}

export default Genres;