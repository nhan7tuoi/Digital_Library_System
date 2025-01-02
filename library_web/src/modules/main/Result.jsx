import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { _findBooks } from "./api";
import Loading from "../../components/Loading";

const Result = () => {
  const location = useLocation();
  const { value } = location.state || {};
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [value]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await _findBooks(value);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <div className="px-5 py-2 w-full h-full">
        {data.length > 0 ? (
          <div className="p-3 rounded-md bg-white grid grid-cols-3 gap-4">
            {data.map((b, index) => (
              <Link
                key={`${b._id}_${index}`}
                to={"/book"}
                state={{ book: b._id }}
                className=" p-2 hover:text-black hover:bg-gray-200 rounded-md border"
              >
                <div className="flex space-x-2">
                  <img
                    src={b.image}
                    className="rounded-md"
                    style={{ width: 200, height: 300, objectFit: "cover" }}
                  />

                  <div className="space-y-2 w-1/2">
                    <p className="font-bold text-lg text-blue-600 overflow-hidden">
                      {b.title}
                    </p>
                    <p>{b.author}</p>
                    <p className="text-ellipsis line-clamp-6">{b.summary}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-lg font-semibold">
            <p>Không tìm thấy kết quả</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
