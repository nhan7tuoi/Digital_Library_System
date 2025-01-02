import React, { useEffect, useState } from "react";
import { TbUsersGroup, TbBooks } from "react-icons/tb";
import { _getGenres, _getListNumUsers, _getSummary, _getTopRatings, _getTopViews } from "./apis";
import Chart from "./Chart";

const Home = () => {
  const [top10Views, setTop10Views] = useState([]);
  const [listGenres, setListGenres] = useState([]);
  const [top10Ratings, setTop10Ratings] = useState([]);
  const [listNumUsers, setListNumUsers] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  // Tính ngày của tuần trước (7 ngày trước)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoFormatted = oneWeekAgo.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(oneWeekAgoFormatted);
  const [endDate, setEndDate] = useState(today);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [summary, setSummary] = useState();
  useEffect(() => {
    fetchData(); // Gọi hàm fetchData
    fetchDataChart();
  }, []);
  const fetchData = async () => {
    try {
      const resListGenres = await _getGenres();
      setListGenres(resListGenres.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataChart = async () => {
    try {
      const resTopViews = await _getTopViews(startDate, endDate, selectedGenre);
      setTop10Views(resTopViews.data);
      const resTopRatings = await _getTopRatings(startDate, endDate, selectedGenre);
      setTop10Ratings(resTopRatings.data);
      const resListNumUsers = await _getListNumUsers(startDate, endDate);
      setListNumUsers(resListNumUsers.data);
      const resSummary = await _getSummary(startDate, endDate, selectedGenre);
      setSummary(resSummary.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    if (new Date(e.target.value) > new Date(endDate)) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleGenreChange = (e) => {
    console.log(e.target.value);

    setSelectedGenre(e.target.value);
  };

  return (
    <div className="m-2 space-y-2">
      <form className="bg-white p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex justify-center items-center space-x-2 ">
            <label className="text-base font-medium">From:</label>
            <input
              type="date"
              max={today}
              value={startDate}
              onChange={handleStartDateChange}
              className="border rounded p-2"
            />
          </div>

          <div className="flex justify-center items-center space-x-2">
            <label className=" text-base font-medium">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              className="border rounded p-2"
            />
          </div>
          <div className="flex justify-center items-center space-x-2 col-span-1">
            <label className=" text-base font-medium">Genre:</label>
            <select className="w-40" onChange={handleGenreChange}>
              <option value={""} className="text-center">
                ------
              </option>
              {listGenres.map((genre) => (
                <option value={genre._id} key={genre._id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => fetchDataChart()}
            className="px-4 py-2 bg-slate-400 text-slate-900 font-medium rounded disabled:opacity-50"
            disabled={!startDate || !endDate}
          >
            Confirm
          </button>
        </div>
      </form>
      <div className="space-y-2 mt-2">
        <div className="bg-white p-4 rounded-lg items-center flex space-x-2">
          <div className="w-10 h-10 rounded-full bg-cyan-500 items-center justify-center flex">
            {TbBooks({ size: 32, color: "white" })}
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Total:{" "}
              <span className="font-medium text-black text-base">
                {summary?.totalBooksByGenre}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              New:{" "}
              <span className="font-medium text-black text-base">
                {summary?.newBooksByGenre}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Total readers:{" "}
              <span className="font-medium text-black text-base">
                {summary?.totalReadersByGenre}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Total views:{" "}
              <span className="font-medium text-black text-base">
                {summary?.totalViewsByGenre}
              </span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg items-center flex space-x-2">
            <Chart
              dataList={top10Views}
              barColor={"rgb(137, 218, 235)"}
              direction={"y"}
              lable={"Views"}
              title={"Top 10 highest views books"}
              type={"view"}
            />
          </div>
          <div className="bg-white p-4 rounded-lg items-center flex space-x-2">
            <Chart
              dataList={top10Ratings}
              barColor={"rgb(240, 138, 95)"}
              direction={"y"}
              lable={"Ratings"}
              title={"Top 10 highest ratings books"}
              type={"rating"}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg items-center flex space-x-2 h-28">
          <div className="w-10 h-10 rounded-full bg-orange-600 items-center justify-center flex">
            {TbUsersGroup({ size: 32, color: "white" })}
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Total:{" "}
              <span className="font-medium text-black text-base">
                {summary?.totalUsers}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              New:{" "}
              <span className="font-medium text-black text-base">
                {summary?.newUsers}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg items-center flex">
          <Chart
            dataList={listNumUsers}
            barColor={"rgb(186, 73, 30)"}
            direction={"x"}
            lable={"Users"}
            title={`New users from ${startDate} to ${endDate}`}
            type={"user"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
