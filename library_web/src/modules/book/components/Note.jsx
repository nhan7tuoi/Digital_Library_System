import { Button, Form, Modal, Input } from "antd";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { _createNote, _deleteNote, _getNotes, _updateNote } from "../api";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const { TextArea } = Input;
const Note = ({ page, setPage }) => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const book = location.state.book;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [selectedNote, setSelectedNote] = useState({});

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await _getNotes(book._id);
      setNotes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal1 = () => {
    setOpen1(true);
  };
  const showModal3 = (n) => {
    setSelectedNote(n);
    setOpen3(true);
  };
  const showModal2 = (c) => {
    setSelectedNote(c); // Cập nhật nội dung của note vào state
    form2.setFieldsValue({
      noteId: c._id, // Set the new note ID
      content: c.content, // Set the new content
    });
    setOpen2(true); // Mở Modal
  };
  const handleOk1 = () => {
    form.submit();
  };
  const handleFinish = async (values) => {
    setConfirmLoading(true);
    const note = { bookId: book._id, page: page, content: values.content };
    await _createNote(note);
    await fetchNotes();
    setConfirmLoading(false);
    setOpen1(false);
    form.resetFields();
  };

  const handleFinish2 = async (values) => {
    setConfirmLoading(true);
    const note = {
      bookId: book._id,
      content: values.content,
      noteId: values.noteId,
    };
    console.log(note);

    await _updateNote(note);
    await fetchNotes();
    setConfirmLoading(false);
    setOpen2(false);
  };

  const handleOk2 = () => {
    form2.submit();
  };
  const handleCancel1 = () => {
    console.log("Clicked cancel button");
    setOpen1(false);
  };
  const handleCancel2 = () => {
    console.log("Clicked cancel button");
    setOpen2(false);
  };
  const handleCancel3 = () => {
    console.log("Clicked cancel button");
    setOpen3(false);
  };
  const handleDelete = async (nodeId) => {
    try {
      setConfirmLoading(true);
      const response = await _deleteNote(nodeId);
      await fetchNotes();
      setConfirmLoading(false);
      setOpen3(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="py-2 pr-4 bg-white h-svh flex flex-col">
      <div className="flex-grow overflow-auto bg-white rounded-lg shadow-inner border border-gray-300">
        {/* Tiêu đề của danh sách chương */}
        <div className="p-3 bg-blue-100 border-b border-gray-300 text-gray-700 font-semibold text-lg justify-between items-center flex">
          <p>Ghi chú</p>
          <Button
            style={{ fontSize: 25, color: "#2563EB" }}
            onClick={showModal1}
          >
            <IoMdAdd />
          </Button>
        </div>

        {/* Nội dung danh sách chương */}
        <div className="space-y-2 p-3">
          {notes?.map((n, index) => (
            <div className="flex space-x-1 " key={index}>
              <div className="hover:bg-blue-100 transition-colors duration-200 w-11/12 rounded-md overflow-hidden">
                <Button
                  onClick={() => showModal2(n)}
                  type="link"
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg flex justify-start w-full hover:bg-blue-100"
                >
                  <p className="line-clamp-1 text-ellipsis text-sm truncate max-w-full">
                    {n.content}
                  </p>
                </Button>
              </div>

              <div>
                <Button
                  type="link"
                  className="text-lg p-0"
                  onClick={()=>showModal3(n)}
                >
                  <MdDelete />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        title="Thêm mới"
        open={open1}
        onOk={handleOk1} // Gọi handleOk1 khi nhấn "Lưu"
        confirmLoading={confirmLoading}
        onCancel={handleCancel1}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`Trang ${selectedNote.page + 1}`}
        open={open2}
        onOk={handleOk2}
        confirmLoading={confirmLoading}
        onCancel={handleCancel2}
      >
        <Form form={form2} onFinish={handleFinish2}>
          <Form.Item name="noteId" hidden></Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Ghi chú này sẽ bị xóa vĩnh viễn bạn vẫn tiếp tục chứ?"
        open={open3}
        onOk={()=>handleDelete(selectedNote._id)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel3}
      >
      </Modal>
    </div>
  );
};

export default Note;
