import React, { useEffect, useState } from "react";
import { getGenres } from "./api";
import { Button, Divider, Space, Tooltip } from "antd";
import { _getBooksByGenre } from "../book/api";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

const Genre = () => {
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchGenres();
  }, []);
  const fetchGenres = async () => {
    try {
      setIsLoading(true)
      const response = await getGenres();
      if (response.data) await handleChangeGenres(response.data[0]._id);
      setGenres(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeGenres = async (genreId) => {
    try {
      setIsLoading(true);
      const response = await _getBooksByGenre(genreId);
      setBooks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
    {isLoading && <Loading/>}
      <div className="px-5 py-2 space-y-3">
        <div className=" bg-white p-3 rounded-md shadow-md">
          <Space wrap>
            {genres?.map((g) => (
              <Tooltip title={g.name} key={g._id}>
                <Button onClick={() => handleChangeGenres(g._id)}>
                  {g.name}
                </Button>
              </Tooltip>
            ))}
          </Space>
        </div>
        <div className="p-3 rounded-md bg-white grid grid-cols-3 gap-4 shadow-md">
          {books.map((b, index) => (
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
        <div></div>
      </div>
    </>
  );
};

export default Genre;
