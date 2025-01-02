import React, { useRef } from "react";
import BookDetail from "./components/BookDetail";
import Reviews from "./components/Reviews";

const BookLayout = () => {
  return (
    <div>
      <div className="px-5 py-2">
        <BookDetail />
      </div>
      <div className="px-5 py-2">
        <Reviews />
      </div>
    </div>
  );
};

export default BookLayout;
