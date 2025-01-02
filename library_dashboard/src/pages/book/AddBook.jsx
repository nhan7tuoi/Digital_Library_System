import React, { useEffect, useState } from "react";
import { CButton, CForm, CFormInput, CFormSelect, CCol, CRow, CCard, CCardBody, CSpinner } from '@coreui/react';
import { Button, message, Modal, notification, Spin } from "antd"; // Keep Ant Design message for notifications
import { Link, useNavigate } from "react-router-dom";
import { _createBook, _getGenres, _getMajors } from "./apis";
import  Loading  from "../../components/Loading";


const AddBook = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [majors, setMajors] = useState([]);
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    majors: "",
    publisher: "",
    yob: "",
  });
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const [bookId, setBookId] = useState("");

  useEffect(() => {
    getGenres();
    getMajors();
  }, []);

  const getGenres = async () => {
    const response = await _getGenres();
    setGenres(response.data);
  };

  const getMajors = async () => {
    const response = await _getMajors();
    setMajors(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedPdfFile(file);
    } else {
      openNotification(true,"Bạn chỉ có thể tải lên file PDF!","Lỗi tải lên")();
    }
  };

  const handleFileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImageFile(file);
    } else {
      openNotification(true,"Bạn chỉ có thể tải lên file ảnh!","Lỗi tải lên")();
    }
  };

  const handleGenreChange = (value) => {
    setFormData((prev) => ({ ...prev, genre: value }));
  };

  const handleMajorChange = (value) => {
    setFormData((prev) => ({ ...prev, majors: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (!selectedPdfFile || !selectedImageFile) {
      openNotification(true,"Vui lòng chọn file PDF và ảnh!","Lỗi tải lên")();
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("genre", formData.genre);
    data.append("majors", formData.majors); 
    data.append("publisher", formData.publisher);
    data.append("yob", formData.yob);
    data.append("pdf", selectedPdfFile);
    data.append("image", selectedImageFile); 

    setLoading(true);
    try {
      const response = await _createBook(data);
      console.log(response.message);
      console.log(response.data._id);
      if (response.data.chapter == false) {
        navigate("/books/add-chapter", {
          state: {
            data: {
              bookId: response.data.book._id,
              title: response.data.book.title,
              pdfLink: response.data.book.pdfLink,
              page: response.data.book.pageNumber,
            },
          },
        });
      } else {
        setBookId(response.data.book._id);
        setFormData({
          title: "",
          author: "",
          genre: "",
          majors: "",
          publisher: "",
          yob: "",
        });
        setSelectedPdfFile(null);
        setSelectedImageFile(null);
        setIsVisible(true);
        
        
      }
    } catch (error) {
      console.log(error);
      openNotification(true,"Có lỗi xảy ra!","Lỗi")();
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (pauseOnHover,description,title) => () => {
    api.open({
      message: title,
      description:description,
      showProgress: true,
      pauseOnHover,
    });
  };
  const handleOk = () => {
    setIsVisible(false);
    navigate("/books/detail",{
      state: {
        data: {
          bookId: bookId,
        },
      },
    });
  };
  const handleCancel = () => {
    setIsVisible(false);
  };

  const isValidYear = (year) => {
    const yearNumber = Number(year);
    return yearNumber >= 1900 && yearNumber <= currentYear;
  };


  const validateForm = () => {
    //từng lỗi
    if (!formData.title) {
      openNotification(true,"Vui lòng nhập tiêu đề sách!","Lỗi")();
      return false;
    }
    if (!formData.author) {
      openNotification(true,"Vui lòng nhập tác giả!","Lỗi")();
      return false;
    }
    if (!formData.publisher) {
      openNotification(true,"Vui lòng nhập nhà xuất bản!","Lỗi")();
      return false;
    }
    if (!formData.yob) {
      openNotification(true,"Vui lòng nhập năm xuất bản!","Lỗi")();
      return false;
    }
    if (!isValidYear(formData.yob)) {
      openNotification(true,"Năm xuất bản không hợp lệ! Phải là từ 1000 - năm hiện tại","Lỗi")();
      return false;
    }
    if (!formData.genre) {
      openNotification(true,"Vui lòng chọn thể loại!","Lỗi")();
      return false;
    }
    if (!formData.majors) {
      openNotification(true,"Vui lòng chọn khoa!","Lỗi")();
      return false;
    }
    if (!selectedPdfFile) {
      openNotification(true,"Vui lòng chọn file PDF!","Lỗi")();
      return false;
    }
    if (!selectedImageFile) {
      openNotification(true,"Vui lòng chọn ảnh bìa!","Lỗi")();
      return false;
    }
    return true;
  }

  return (
    <>
      <Modal 
      wrapStyle={{padding: "50px"}}
      title="Thông báo"
       open={isVisible}
        onOk={handleOk}
         onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
            Thêm sách khác
          </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Xem chi tiết
            </Button>,
          ]}
         >
        <p>Thêm sách thành công. Bạn có thể xem chi tiết sách đã thêm </p>
      </Modal>
    {contextHolder}
      {loading && (
          <Loading/>
        )}
      <CCard className="max-w-3xl mx-auto p-6 mt-8">
        <CCardBody>
          <h2 className="text-2xl mb-4 text-primary">Thêm Sách Mới</h2>
          <CForm onSubmit={handleSubmit} className="space-y-4">
            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Tiêu tên sách</label>
                <CFormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sách"
                  valid={formData.title.length > 0}
                  invalid={formData.title.length === 0}
                  
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Tác giả</label>
                <CFormInput
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Nhập tên tác giả"
                  valid={formData.author.length > 0}
                  invalid={formData.author.length === 0}
                  
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Nhà xuất bản</label>
                <CFormInput
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Nhập tên nhà xuất bản"
                  valid={formData.publisher.length > 0}
                  invalid={formData.publisher.length === 0}
                  
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Năm xuất bản</label>
                <CFormInput
                  type="number"
                  name="yob"
                  min="1000"
                  max={currentYear}
                  value={formData.yob}
                  onChange={handleInputChange}
                  placeholder="Nhập năm xuất bản"
                  valid={isValidYear(formData.yob)}
                  invalid={!isValidYear(formData.yob)}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">PDF File:</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFilePdfChange}
                  
                  className="form-control"
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Thể loại</label>
                <CFormSelect
                  name="genre"
                  value={formData.genre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  
                >
                  <option value="" disabled>
                    Chọn thể loại
                  </option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Khoa</label>
                <CFormSelect
                  name="majors"
                  value={formData.majors}
                  onChange={(e) => handleMajorChange(e.target.value)}
                >
                  <option value="" disabled>
                    Chọn khoa
                  </option>
                  {majors.map((major) => (
                    <option key={major._id} value={major._id}>
                      {major.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Ảnh bìa sách</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileImageChange}
                  required
                  className="form-control"
                />
              </CCol>
            </CRow>

            {selectedImageFile && (
              <CRow className="mb-3">
                <CCol>
                  <h3 className="text-sm fw-bold">Ảnh bìa đã chọn:</h3>
                  <img
                    src={URL.createObjectURL(selectedImageFile)}
                    alt="Selected Cover"
                    className="mt-2 h-48 object-cover border rounded-md"
                  />
                </CCol>
              </CRow>
            )}

            <CRow className="mt-4">
              <CCol className="text-end">
                <CButton type="submit" color="success" disabled={loading}>
                  <span className="text-white">Thêm sách</span>
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
};

export default AddBook;
