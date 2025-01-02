import { useEffect, useState } from "react";
import { _getGenres } from "../home/apis";
import { Button, Col, ConfigProvider, Space, Table } from "antd";
import { CCol } from "@coreui/react";
import Search from "antd/es/transfer/search";
import { _getMajors } from "../user/apis";
import { useSelector } from "react-redux";
import { ConfigContext } from "antd/lib/config-provider";

const Majors = () => {
    const [majors, setMajors] = useState([]);
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
            title: "Tên khoa",
            dataIndex: "name",
            key: "name",
        }
    ]

    useEffect(() => {
        getMajors();
    }, []);

    const getMajors = async () => {
        setLoading(true);
        try {
            const res = await _getMajors();
            if(res.data){
                setMajors(res.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleSearch = (value) => {
        if(value){
            const filter = majors.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
            setMajors(filter);
        } else {
            getMajors();
        }
    }
    
    return (
        <ConfigProvider theme={{ token: themeTokens }}>
        <div>
            <CCol style={{padding:20}}>
        <Search placeholder="Nhập từ khóa" onChange={(e) => handleSearch(e.target.value)} />
        </CCol>
            <Table 
            title={()=>{
          return (
            <Col>
              <h3>Danh sách khoa</h3>
            </Col>
          )
        }}  dataSource={majors} columns={column} loading={loading} rowKey="id" pagination={{pageSize:5}}/>
        </div>
        </ConfigProvider>
    );
}

export default Majors;