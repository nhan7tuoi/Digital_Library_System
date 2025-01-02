import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FaHeadphones } from "react-icons/fa6";
import { IoIosBook } from "react-icons/io";
import { _getChapterByIdBook } from "../api";
import { MdOutlineArrowBack } from "react-icons/md";

const Chapters = ({ page, setPage }) => {
  const [chapters, setChapters] = useState([]);
  const [isAudio, setIsAudio] = useState(false);
  const navigate = useNavigate();
  const book = JSON.parse(localStorage.getItem("book"));
  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const response = await _getChapterByIdBook(book._id);
      console.log(response.data);

      setChapters(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAudio = () => {
    setIsAudio(true);
    // navigate("/book-audio", { state: { book: book, page: 2 } });
    navigate("/book-audio", { state: { book: book, page: page + 2 } });
  };
  const handleText = () => {
    setIsAudio(false);
    // navigate("/book-content", { state: { book: book, page: 0 } });
    navigate("/book-content", { state: { book: book, page: page } });
  };
  const handleChangeChapter = (c) => {
    if (isAudio) {
      setPage(c.startPage - 1);
      console.log(page);
      navigate("/book-audio", { state: { book: book, page: c.startPage + 1 } });
    } else {
      setPage(c.startPage);
      console.log("page", page);
      navigate("/book-content", {
        state: { book: book, page: c.startPage - 1 },
      });
    }
  };
  return (
    <div className="py-2 bg-white h-svh flex flex-col">
      <div className="space-x-4 sticky top-2 bg-white z-10 p-3 shadow-lg border border-gray-200 rounded-md flex items-center">
        <Button
          style={{ fontSize: 25, color: "#2563EB" }}
          onClick={() => navigate("/book", { state: { book: book._id } })}
        >
          <MdOutlineArrowBack />
        </Button>
        <Button style={{ fontSize: 25, color: "#2563EB" }} onClick={handleText}>
          <IoIosBook />
        </Button>
        <Button
          style={{ fontSize: 25, color: "#2563EB" }}
          onClick={handleAudio}
        >
          <FaHeadphones />
        </Button>
      </div>

      <div className="flex-grow overflow-auto bg-white rounded-lg shadow-inner border border-gray-300 mt-4">
        {/* Tiêu đề của danh sách chương */}
        <div className="p-3 bg-blue-100 border-b border-gray-300 text-gray-700 font-semibold text-lg text-center">
          Danh sách chương
        </div>

        {/* Nội dung danh sách chương */}
        <div className="space-y-2 p-3">
          {chapters?.map((c, index) => (
            <div
              className="px-4 rounded-md transition-colors duration-200 hover:bg-blue-100"
              key={index}
            >
              <Button
                onClick={() => handleChangeChapter(c)}
                type="link"
                className="text-gray-700 hover:text-blue-600 font-medium text-left inline-block max-w-full"
                style={{ padding: "0.5rem 1rem", whiteSpace: "normal" }}
              >
                <p className="whitespace-normal break-words max-w-full">
                  {c.title}
                </p>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chapters;
