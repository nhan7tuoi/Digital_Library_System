import { CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from "@coreui/react";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { _getGenres } from "../home/apis";
import { _getMajors } from "../user/apis";
import { _createMajors } from "./apis";
import Loading from "../../components/Loading";

const AddMajors = () => {
    const [majors, setMajors] = useState([]);
    const [major, setMajor] = useState({});
    const [loading, setLoading] = useState(false);

    const columns = [
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

    const handleCreateMajor = async () => {
        setLoading(true);
        try {
            const res = await _createMajors(major.name);
            if(res.data){
                setMajors([...majors,res.data]);
                setMajor({});
                setLoading(false);
                openNotification(true,"Khoa đã được thêm thành công!","Thành công")();
            }
        } catch (error) {
            setLoading(false);
            openNotification(true,"Đã xảy ra lỗi khi thêm khoa!","Lỗi")();
        }
    }

    const openNotification = (pauseOnHover,description,title) => () => {
        api.open({
          message: title,
          description:description,
          showProgress: true,
          pauseOnHover,
        });
      }

    return (
        <>
        {
            loading && <Loading/>
        }
        <CRow>
            <CCol xs={12} md={5}>
                <CCard className="mb-4">
                <CCardHeader className='font-weight-bold h4'>Thêm mới khoa</CCardHeader>
                <CCardBody>
                    <CCol>
                        <CFormInput
                        type="text"
                        placeholder="Nhập tên khoa"
                        value={major.name}
                        onChange={(e) => setMajor({ ...major, name: e.target.value })}
                        />
                    </CCol>
                    <div style={{height:30}}/>
                    <CCol xs="auto">
                        <Button disabled onClick={handleCreateMajor} type="primary" className="px-4 py-2 text-dark font-medium rounded disabled-opacity-50">
                        <span className="text-base text-white">Thêm khoa</span>
                        </Button>
                    </CCol>
                </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={12} md={7}>
                <Table 
                title={() => (
                    <span className="font-weight-bold h4">Danh sách khoa</span>
                )}
                scroll={
                    { y: 380 }
                } columns={columns} dataSource={majors} pagination={{pageSize:10}}/>
                </CCol>
            </CRow>
            </>
    )
}
export default AddMajors;