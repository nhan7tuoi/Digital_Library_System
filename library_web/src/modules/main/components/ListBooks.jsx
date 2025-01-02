import { Button, Image } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { _createView } from "../../book/api";
import { _deleteHistory } from "../api";

const ListBooks = ({ title, data }) => {
  const [histories, setHistories] = useState([]);
  console.log(data);
  useEffect(() => {
    if (data) {
      setHistories(data);
    }
  }, [data]);
  const navigate = useNavigate();
  const handleContinuteRead = async (book,page) => {
    try {
      const response = await _createView(book._id);
      localStorage.setItem("book", JSON.stringify(book));
      navigate("/book-content", {
        state: { book: book, page: page },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteHistory = async (historyId) => {
    try {
      const response = await _deleteHistory(historyId);
      setHistories(histories.filter((h) => h._id !== historyId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="bg-white rounded-md p-3 shadow-md space-y-3 h-1/2">
      <p className="font-bold text-2xl">{title}</p>
      <div className="flex whitespace-nowrap overflow-auto space-x-3 h-full">
        {histories?.map((h, index) => (
          <div key={`${h._id}_${index}`} className="h-full p-2 w-fit border">
            <Link
              to={"/book"}
              state={{ history: h, book: h.book._id }}
              className="h-full p-2 hover:text-black hover:bg-gray-200 rounded-md  flex items-center"
            >
              <div>
                <Image
                  src={h.book.image}
                  className=""
                  style={{ width: 200, height: 300, objectFit: "cover" }}
                />
                <div className="flex flex-col">
                  <div className="w-40">
                    <p className="font-bold text-lg text-blue-600 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                      {h.book.title}
                    </p>
                    <p className=" overflow-hidden whitespace-nowrap text-ellipsis w-full">
                      {h.book.author}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
            <div className="flex justify-around items-center ">
              <Button
                onClick={() => handleContinuteRead(h.book, h.page)}
                className="hover:text-blue-700 z-20 bg-green-600 text-white"
              >
                Đọc tiếp
              </Button>
              <Button
                onClick={() => handleDeleteHistory(h._id)}
                className="hover:text-blue-700 z-20 bg-orange-400 text-white"
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListBooks;
