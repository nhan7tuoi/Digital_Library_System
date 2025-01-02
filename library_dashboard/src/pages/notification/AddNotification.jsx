import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CFormLabel, CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import { _getUsers } from '../user/apis';
import { _getBook, _getMajors } from '../book/apis';
import { _createNotification, _updateNotification } from './apis';
import { useLocation } from 'react-router-dom';
import { notification } from 'antd';
import Loading from '../../components/Loading';

const AddNotification = () => { 
  const location = useLocation(); 
  const notificationItem = location.state?.notificationItem;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isFilterConditionModalOpen, setIsFilterConditionModalOpen] = useState(false);
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [secondarySelection, setSecondarySelection] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [majors, setMajors] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notificationItem) {
      setTitle(notificationItem.title);
      setContent(notificationItem.content);
      setFilterCondition(notificationItem.filterCondition.type);
      setSecondarySelection(notificationItem.filterCondition.type === 'ALL' ? [] : notificationItem.filterCondition.value || []);
      setPreviewImage(notificationItem.image);
    }
  }, [notificationItem]);

  const fetchData = async () => {
    const resUser = await _getUsers();
    const resMajor = await _getMajors();
    const resBook = await _getBook();
    setUsers(resUser.data);
    setMajors(resMajor.data);
    setBooks(resBook.data);
  };

  const handleSelectData = (item) => {
    if (!selectedData.includes(item)) {
      setSelectedData([...selectedData, item]);
    }
  };

  const handleSelectFilterCondition = (condition) => {
    setIsFilterConditionModalOpen(false);
    setFilterCondition(condition);
    setSecondarySelection([]);
    setIsSecondaryModalOpen(
      condition === 'Theo Người dùng' || condition === 'Theo Ngành' ? true : false
    );
  };

  const handleSelectSecondaryOption = (option) => {
    if (!secondarySelection.includes(option)) {
      setSecondarySelection([...secondarySelection, option]);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveNotification = async () => {
    if (!title || !content || !filterCondition || selectedData.length === 0) {
      return api.open({
        message: 'Vui lòng điền đầy đủ thông tin!',
        description: 'Tiêu đề, nội dung, kiểu lọc và sách không được để trống!',
        type: 'warning',
      });
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    let filterConditionObject;
    if (filterCondition === 'Theo Người dùng') {
      filterConditionObject = { userId: secondarySelection.map((item) => item._id), type: 'USER' };
    } else if (filterCondition === 'Theo Ngành') {
      filterConditionObject = { major: secondarySelection.map((item) => item._id), type: 'MAJOR' };
    } else if (filterCondition === 'Tất cả') {
      filterConditionObject = { type: 'ALL' };
    }
    formData.append('filterCondition', JSON.stringify(filterConditionObject));
    const selectedObject = JSON.stringify(selectedData.map((item) => item._id));
    formData.append('data', selectedObject);

    if (previewImage) {
      formData.append('image', {
        uri: previewImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      let response;
      if (notificationItem) {
        response = await _updateNotification(notificationItem._id, formData);
      } else {
        response = await _createNotification(formData);
      }

      if (response.data) {
        openNotification(true,notificationItem ? 'Thông báo đã được cập nhật thành công!' : 'Thông báo đã được thêm thành công!','Thành công')();
        setTimeout(() => {
          navigation.navigate('/#/notifications/list');
        }, 3000);
      }
    } catch (error) {
      console.log(error);
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
  }
  return (
    <>
    {contextHolder}
    {
      loading && <Loading/>
    }
    <CCol className="d-flex align-items-center justify-content-center">
      <CCard className="w-100 max-w-2xl shadow-lg border-0">
        <CCardHeader>
          <h2>{notificationItem ? 'Cập Nhật Thông Báo' : 'Thêm Thông Báo'}</h2>
        </CCardHeader>
        <CCardBody>
          <div className="mb-4">
            <CFormLabel className="fw-bold">Tiêu đề</CFormLabel>
            <CFormInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." />
          </div>

          <div className="mb-4">
            <CFormLabel className="fw-bold">Nội dung</CFormLabel>
            <CFormTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung..." />
          </div>

          <div className="mb-4">
            <CFormLabel className="fw-bold">Tải lên hình ảnh</CFormLabel>
            <CFormInput type="file" accept="image/*" onChange={handleImageUpload} />
            {previewImage && (
              <div className="mt-4 text-center">
                <p className="fw-semibold">Xem trước hình ảnh:</p>
                <img src={previewImage} alt="Preview" className="w-14 h-auto mt-2 rounded-lg shadow-sm" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <CButton color="primary" onClick={() => setIsDataModalOpen(true)}>Chọn Sách</CButton>
            {selectedData.length > 0 && (
              <div className="mt-3">
                <p>Sách đã chọn:</p>
                <ul className="ps-3">
                  {selectedData.map((data, index) => (
                    <li key={index} className="text-sm">{data.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-4">
            <CButton style={{backgroundColor:'blueviolet'}} onClick={() => setIsFilterConditionModalOpen(true)}>
              <span className="text-white">Chọn Kiểu Lọc</span>
            </CButton>
            {filterCondition && (
              <div className="mt-3">
                <p>Kiểu lọc đã chọn: {filterCondition}</p>
                <ul className="ps-3">
                  {secondarySelection.map((item, index) => (
                    <li key={index} className="text-sm">{item.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-5">
            <div/>
            <CButton color='success' className="px-4" onClick={handleSaveNotification}>
              <span className="text-white">
              {notificationItem ? 'Cập Nhật Thông Báo' : 'Lưu Thông Báo'}
              </span>
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {/* Modals */}
      <CModal alignment="center" visible={isDataModalOpen} onClose={() => setIsDataModalOpen(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Chọn Sách</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput placeholder="Tìm kiếm sách..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <ul className="list-unstyled mt-3">
            {books.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book, index) => (
              <li key={index} onClick={() => handleSelectData(book)} className="py-1 cursor-pointer border-bottom">
                {book.title}
              </li>
            ))}
          </ul>
        </CModalBody>
      </CModal>

      <CModal alignment="center" visible={isFilterConditionModalOpen} onClose={() => setIsFilterConditionModalOpen(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Chọn Kiểu Lọc</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ul className="list-unstyled">
            {['Theo Người dùng', 'Theo Ngành', 'Tất cả'].map((condition, index) => (
              <li key={index} onClick={() => handleSelectFilterCondition(condition)} className="py-1 cursor-pointer border-bottom">
                {condition}
              </li>
            ))}
          </ul>
        </CModalBody>
      </CModal>

      <CModal alignment="center" visible={isSecondaryModalOpen} onClose={() => setIsSecondaryModalOpen(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{filterCondition} Lựa chọn</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CFormInput placeholder="Tìm kiếm sách..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <ul className="list-unstyled">
            {filterCondition === 'Theo Người dùng' ? users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user, index) => (
              <li key={index} onClick={() => handleSelectSecondaryOption(user)} className="py-1 cursor-pointer border-bottom">
                {user.name}
              </li>
            )) : filterCondition === 'Theo Ngành' ? majors.filter((major) => major.name.toLowerCase().includes(searchQuery.toLowerCase())).map((major, index) => (
              <li key={index} onClick={() => handleSelectSecondaryOption(major)} className="py-1 cursor-pointer border-bottom">
                {major.name}
              </li>
            )) : null}
          </ul>
        </CModalBody>
      </CModal>
    </CCol>
    </>
  );
};

export default AddNotification;
