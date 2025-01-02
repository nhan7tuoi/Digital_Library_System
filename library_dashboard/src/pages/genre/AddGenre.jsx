import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from "@coreui/react";
import { Button, notification, Table } from "antd";
import { useEffect, useState } from "react";
import { _getGenres } from "../home/apis";
import { _createGenre } from "./apis";
import Loading from "../../components/Loading";

const AddGenrere = () => {
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState({});
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    const columns = [
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
    }
    , []);

    const getGenres = async () => {
        setLoading(true);
        try {
            const res = await _getGenres();
            if(res.data){
                setGenres(res.data);
                setLoading(false);
            }
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    const handleAddGenre = async () => {
        setLoading(true);
        try {
            const res = await _createGenre(genre.name);
            if(res.data){
                setGenres([...genres,res.data]);
                setGenre({
                    name: ""
                });
                setLoading(false);
                openNotification(true,"Thể loại đã được thêm thành công!","Thành công")();
            }
        }
        catch (error) {
            setLoading(false);
            openNotification(true,"Đã xảy ra lỗi khi thêm thể loại!","Lỗi")();
            
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
        {
            loading && <Loading/>
        }
        <CRow>
            <CCol xs={12} md={5}>
                <CCard className="mb-4">
                <CCardHeader className='font-weight-bold h4'>Thêm mới thể loại</CCardHeader>
                <CCardBody>
                    <CCol>
                        <CFormInput
                        type="text"
                        placeholder="Nhập tên thể loại"
                        value={genre.name}
                        onChange={(e) => setGenre({ ...genre, name: e.target.value })}
                        />
                    </CCol>
                    <div style={{height:30}}/>
                    <CCol xs="auto">
                        <Button disabled onClick={handleAddGenre} type="primary" className="px-4 py-2 text-dark font-medium rounded disabled-opacity-50">
                        <span className="text-base text-white">Thêm thể loại</span>
                        </Button>
                    </CCol>
                </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12} md={7}>
                <Table 
                title={() => (
                    <span className="font-weight-bold h4">Danh sách thể loại</span>
                )}
                scroll={
                    { y: 380 }
                } columns={columns} dataSource={genres} pagination={{pageSize:10}}/>
                </CCol>
            </CRow>
            </>
    )
}
export default AddGenrere;