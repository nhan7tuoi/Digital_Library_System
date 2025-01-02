import React, { useEffect, useState } from "react";
import { CButton, CForm, CFormInput, CFormSelect, CCol, CRow, CCard, CCardBody, CSpinner } from '@coreui/react';
import { Button, message, notification, Spin } from "antd"; // Keep Ant Design message for notifications
import { Link, useLocation, useNavigate } from "react-router-dom";
import { _createBook, _getBook, _getBookById, _getGenres, _getMajors, _updateBook } from "./apis";
import Loading from "../../components/Loading";


const EditBook = () => {
    const location = useLocation();
  const { state } = location || {};
  const { data } = state || {};
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [majors, setMajors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    majors: "",
    yob: "",
    publisher: "",
  });
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const bookId = data.bookId;
  const pdfLink = data.pdfLink;
  const currentYear = new Date().getFullYear();
  const [isMajor, setIsMajor] = useState(false);
  const [isGenre, setIsGenre] = useState(false);

  useEffect(() => {
    getBook(data.bookId);
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

  const getBook = async (id) => {
    const response = await _getBookById(id);
    setFormData({
        title: response.data.title,
        author: response.data.author,
        genre: response.data.genre,
        majors: response.data.majors,
        yob: response.data.yob,
        publisher: response.data.publisher,
    });
    setExistingImageUrl(response.data.image);
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
      message.error("Bạn chỉ có thể tải lên file PDF!");
    }
  };

  const handleFileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedImageFile(file);
    } else {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
    }
  };

  const handleGenreChange = (value) => {
    setIsGenre(true);
    setFormData((prev) => ({ ...prev, genre: value }));
  };

  const handleMajorChange = (value) => {
    setIsMajor(true);
    setFormData((prev) => ({ ...prev, majors: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const genre = genres.find((genre) => genre.name === formData.genre);
    const major = majors.find((major) => major.name === formData.majors);


    const data = new FormData();
    data.append("bookId", bookId);
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("genre", genre._id);
    data.append("majors", major._id); 
    data.append("yob", formData.yob);
    data.append("publisher", formData.publisher);

    
    if(selectedImageFile !== null){
      data.append("image", selectedImageFile); 
    }

    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await _updateBook(data);
      if(response.data.error){
        openNotification(true,response.data.message
          ,"Lỗi")();
        setLoading(false);

      } else {
        openNotification(true,"Sách đã được cập nhật thành công!","Thành công")();
      }
    } catch (error) {
      console.error("Error:", error);
      openNotification(true,"Cập nhật sách thất bại","Lỗi")();
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
    return true;
  }

  const isValidYear = (year) => {
    const yearNumber = Number(year);
    return yearNumber >= 1900 && yearNumber <= currentYear;
  };

  return (
    <>
    {contextHolder}
      {loading && (
          <Loading/>
        )}
      <CCard className="max-w-3xl mx-auto p-6 mt-8">
        <CCardBody>
        <CRow xs={12}>
            <CCol xs={6}>
            <h2 className="text-2xl mb-4 text-primary">
              Chỉnh sửa sách
            </h2>
            </CCol>
            <CCol xs={6} className="text-end">
              <Button 
              type="primary"
              onClick={()=>{
                 navigate("/books/add-chapter", {
                  state: {
                    data: {
                      bookId: data.bookId,
                      title: formData.title,
                      pdfLink: pdfLink,
                    },
                  },
                });
              }}  className="btn btn-primary">
                  Chỉnh sửa chương
              </Button>
            </CCol>
          </CRow>
          <CForm onSubmit={handleSubmit} className="space-y-4">
            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Tiêu đề sách</label>
                <CFormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề sách"
                  required
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
                  required
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
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Năm xuất bản</label>
                <CFormInput
                  type="number"
                  name="yob"
                  min="1900"
                  max="2099"
                  value={formData.yob}
                  onChange={handleInputChange}
                  placeholder="Nhập năm xuất bản"
                  required
                />
              </CCol>
            </CRow>

            {/* <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">PDF File: (Nếu muốn thay đổi thì chọn lại)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFilePdfChange}
                  className="form-control"
                />
              </CCol>
            </CRow> */}

            <CRow className="mb-3">
              <CCol>
                <label className="form-label fw-bold">Thể loại</label>
                <CFormSelect
                  name="genre"
                  value={formData.genre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Chọn thể loại
                  </option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre.name}>
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
                    <option key={major._id} value={major.name}>
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
                  className="form-control"
                />
              </CCol>
            </CRow>

            {selectedImageFile || existingImageUrl ? (
            <CRow className="mb-3">
              <CCol>
                <h3 className="text-sm font-medium text-gray-700">Ảnh bìa đã chọn:</h3>
                {selectedImageFile ? (
                  <img
                    src={URL.createObjectURL(selectedImageFile)}
                    alt="Selected Cover"
                    className="mt-2 h-24 object-cover border rounded-md"
                  />
                ) : (
                  <img
                    src={existingImageUrl}
                    alt="Existing Cover"
                    className="mt-2 h-24 object-cover border rounded-md"
                  />
                )}
              </CCol>
            </CRow>
          ) : null}

            <CRow className="mt-4">
              <CCol className="text-end">
                <CButton type="submit" color="success" disabled={loading}>
                  <span className="text-white">Lưu sách</span>
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
};

export default EditBook;
