import { Button, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  _createHistory,
  _createView,
  _getBookDetails,
  _getHistory,
} from "../api";
import Loading from "../../../components/Loading";

const BookDetail = () => {
  const location = useLocation();
  const bookId = location.state.book;
  const [history, setHistory] = useState({});
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleReadBook = async () => {
    setIsLoading(true);
    await createHistory();
    localStorage.setItem("book", JSON.stringify(book));
    setIsLoading(false);
    navigate("/book-content", { state: { book: book, page: 0 } });
  };
  const handleContinuteRead = async () => {
    try {
      setIsLoading(true);
      const response2 = await _createView(bookId);
      localStorage.setItem("book", JSON.stringify(book));
      setIsLoading(false);
      navigate("/book-content", {
        state: { book: book, page: history.page },
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBookDetails();
    fetchHistory();
  }, []);

  const fetchBookDetails = async () => {
    try {
      const response = await _getBookDetails(bookId);
      setBook(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchHistory = async () => {
    try {
      const response = await _getHistory(bookId);
      console.log(response.data);

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const createHistory = async () => {
    try {
      const history = {
        book: bookId,
        page: 0,
      };
      const response1 = await _createHistory(history);
      const response2 = await _createView(bookId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex space-x-4">
      <div className="w-1/5">
        <Image
          src={book?.image}
          className="rounded-md object-cover"
          alt={book?.title}
        />
        <div className="flex items-center justify-around">
          <div className="flex items-center space-x-2">
            <span>{book?.totalView}</span> <FaRegEye />
          </div>
          <div className="flex items-center space-x-2">
            <span>{Number(book?.avgRating?.toFixed(1) || 0)}</span>{" "}
            <FaStar color="yellow" />
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <Button
            onClick={handleReadBook}
            className="bg-green-600 text-white font-medium text-lg"
          >
            Xem
          </Button>
          {history ? (
            <Button
              onClick={handleContinuteRead}
              className="bg-green-600 text-white font-medium text-lg"
            >
              Đọc tiếp
            </Button>
          ) : null}
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-gray-800 ">{book?.title}</p>
        <p className="text-sm text-gray-600">
          Tác giả: <span className="font-medium">{book?.author}</span>
        </p>
        <p className="text-sm text-gray-600">
          Thể loại: <span className="font-medium">{book?.genre}</span>
        </p>
        <p className="text-sm text-gray-600">
          Khoa: <span className="font-medium">{book?.majors}</span>
        </p>
        <p className="text-sm text-gray-600">Tóm tắt: {book?.summary}</p>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default BookDetail;
