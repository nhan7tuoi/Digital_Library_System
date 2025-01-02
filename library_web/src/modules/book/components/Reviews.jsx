import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Image, Input, message } from "antd";
const { TextArea } = Input;
import Rating from "./Rating";
import { Rate } from "antd";
import { _createReview, _getAllReviews, _getReviewsNewest } from "../api";
const Reviews = () => {
  const location = useLocation();
  const bookId = location.state.book;
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loadings, setLoadings] = useState(false);
  useEffect(() => {
    fetchReviewsNewest();
  }, []);

  const fetchReviewsNewest = async () => {
    try {
      const response = await _getReviewsNewest(bookId);
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllReview = async () => {
    try {
      const response = await _getAllReviews(bookId);
      console.log(response.data);
      setReviews(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
      handleSubmit(); // Gọi hàm xử lý submit
    }
  };

  const handleSubmit = async () => {
    setLoadings(true);
    try {
      if (content.trim() && rating > 0) {
        const review = {
          rating: rating,
          content: content,
          bookId: bookId,
        };
        const response = await _createReview(review);
        fetchReviewsNewest();
        setContent("");
        setRating(0);
        setLoadings(false);
      } else {
        message.warning("Vui lòng nhập đánh giá và chọn số sao.");
      }
    } catch (error) {
      console.log(error);
      setLoadings(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="space-y-2 bg-white rounded-lg shadow-md p-4">
        <p className="mb-2 font-medium text-lg">Để lại đánh giá của bạn:</p>
        <div>
          <Rating totalStars={5} rating={rating} setRating={setRating} />
        </div>
        <div>
          <TextArea
            rows={4}
            value={content}
            onKeyDown={handleKeyPress}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button
            loading={loadings}
            type="primary"
            className="w-40 text-lg font-semibold"
            onClick={handleSubmit}
          >
            Đăng
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {reviews.map((r, index) => (
          <div
            key={`${r._id}_${index}`}
            className="border-b border-gray-300 py-2 space-y-2"
          >
            <div className="flex items-center space-x-2 font-medium">
              <Image src={r.user.image} width={40} className="rounded-full" />
              <p>{r.user.name}</p>
            </div>
            <div className="flex space-x-5 items-center font-thin">
              <Rate disabled value={r.rating} />
              <p>{r.updatedAt}</p>
            </div>
            <div>
              <p>{r.content}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-center underline">
          <Button type="link" onClick={() => fetchAllReview()}>
            View all
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
