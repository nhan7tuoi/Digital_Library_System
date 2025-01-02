import React, { useEffect, useState } from "react";
import PDFViewer from "./components/PDFViewer";
import { Outlet, useLocation } from "react-router-dom";
import Chapters from "./components/Chapters";
import Note from "./components/Note";

const BookContent = () => {
  const [cPage, setCPage] = useState(1);
  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="col-span-2 pl-4">
        <Chapters page={cPage} setPage={setCPage} />
      </div>
      <div className="col-span-6 bg-white ">
        <Outlet context={{cPage,setCPage}}/>
      </div>
      <div className="col-span-2">
        <Note page={cPage} setPage={setCPage} />
      </div>
    </div>
  );
};

export default BookContent;
