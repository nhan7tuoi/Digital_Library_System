import React, { useState } from "react";

const Rating = ({ totalStars = 5, rating, setRating }) => {
  const handleClick = (value) => {
    setRating(value);
  };

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <svg
            key={starValue}
            onClick={() => handleClick(starValue)}
            className={`h-6 w-6 cursor-pointer mx-0.5 ${
              starValue <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.086 1.125-6.577L0 6.354l6.615-.96L10 0l2.385 5.394L19 6.354l-5.247 5.155 1.125 6.577z" />
          </svg>
        );
      })}
      <span className="ml-2 text-gray-700">
        {rating} / {totalStars}
      </span>
    </div>
  );
};

export default Rating;
