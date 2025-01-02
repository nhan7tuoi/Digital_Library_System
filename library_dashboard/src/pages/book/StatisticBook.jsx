import { CButton, CCol, CFormInput, CFormLabel, CFormSelect, CRow } from "@coreui/react";
import { _getGenres, _getMajors, _getTopRating, _getTopView } from "./apis";
import { useEffect, useRef, useState } from "react";
import { CChartBar } from "@coreui/react-chartjs";
import { Button, Input } from "antd";
import {Roboto_Regular}  from "../../assets/fonts/Roboto_Regular";
import {Roboto_Bold} from "../../assets/fonts/Roboto_Bold";
import { formatDate } from "../../utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loading from "../../components/Loading";


const loaiThongKe = [
    {
        id: 1,
        type:"VIEW",
        title:"Sách có lượt xem nhiều nhất"
    },
    {
        id: 2,
        type:"RATE",
        title:"Sách có lượt đánh giá cao nhất"
    }
]

const StatisticBook = () => {
    const today = new Date().toISOString().split("T")[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoFormatted = oneWeekAgo.toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(oneWeekAgoFormatted);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const chartRef = useRef(null);
    const [thongKe, setThongKe] = useState(loaiThongKe[0]);
    const [statisticData, setStatisticData] = useState([]);
    const [majors, setMajors] = useState([]);
    const [selectedMajors, setSelectedMajors] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));

    

    useEffect(() => {
        getMajors();
    }, []);

    const getMajors = async () => {
        try {
            const res = await _getMajors();
            setMajors(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        if (new Date(e.target.value) > new Date(endDate)) {
            setEndDate("");
        }
    }

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    }

    const handleChangeMajors = (e) => {
        setSelectedMajors(e.target.value);
    }

    const handleChangeLoaiThongKe = (e) => {
        const value = e.target.value;
        const selected = loaiThongKe.find((a) => a.title === value);
        setThongKe(selected);
    }

    const handleChange = (e) => {
        const value = e.target.value; 
        const numericValue = Number(value);
        if (value === '') {
            setLimit(''); 
        } else if (!isNaN(numericValue)) {
            if (numericValue < 1) {
                setLimit(1);
            } else if (numericValue > 20) {
                setLimit(20);
            } else {
                setLimit(numericValue); 
            }
        }
    };

    const handleThongKe = async () => {
        setLoading(true);
        const data ={
            startDate,
            endDate,
            limit,
            majorsId: selectedMajors,
        }
         try {
            if(thongKe.id === 1){
                const response = await _getTopView(data);
                if(response.data){
                    console.log(response.data);
                    setStatisticData(response.data);
                    setLoading(false);
                }
             } else {
                const response = await _getTopRating(data);
                if(response.data){
                    console.log(response.data);
                    setStatisticData(response.data);
                    setLoading(false);
                }
             }
         } catch (error) {
            setLoading(false);
             console.log(error);
            
         }
    }



    const exportToPDF = () => {
        const doc = new jsPDF("p", "pt", "a4");
        const pageWidth = doc.internal.pageSize.getWidth(); 
    
        doc.addFileToVFS("Roboto-Regular.ttf", Roboto_Regular);
        doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
        doc.addFileToVFS("Roboto-Bold.ttf", Roboto_Bold);
        doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
        doc.setFont("Roboto");
    
        doc.setFontSize(12);

        const exporterName = user.name;
        const exportDate = `${new Date().toLocaleString("vi-VN")}`;

        doc.setFont("Roboto", "normal"); 
        doc.text("Người xuất: ", 40, 30); 
        doc.setFont("Roboto", "bold");
        doc.text(exporterName, 105, 30); 

        doc.setFont("Roboto", "normal"); 
        doc.text("Ngày xuất: ", 40, 50); 
        doc.setFont("Roboto", "bold");
        doc.text(exportDate, 105, 50); 
        

        doc.setFontSize(24);
        doc.setFont("Roboto", "bold");
        const exportTitle = "Thống kê Sách";
        const textWidth = doc.getTextWidth(exportTitle);
        const xPosition = (pageWidth - textWidth) / 2;
        doc.text(exportTitle, xPosition, 100); 

        doc.setFontSize(14);
        doc.setFont("Roboto","normal");
        const exportDateRange = `Thống kê được lấy từ ${formatDate(startDate)} đến ${formatDate(endDate)}`;
        const exportLoaiThongKe = `Loại thống kê: Top ${limit} ${thongKe.title} `;
        const exportGenre = `Khoa: ${selectedMajors ? majors.find((m) => m._id === selectedGenre).name : "Tất cả"}`;
        doc.text(exportDateRange, 40, 140);
        doc.text(exportLoaiThongKe, 40, 160);
        doc.text(exportGenre, 40, 180);

        if (chartRef.current) {
            const chart = chartRef.current;
            const chartImage = chart.toBase64Image();
            const xPosition = (pageWidth - 500) / 2;
            doc.addImage(chartImage, "PNG", xPosition, 250, 500, 300)
            doc.setFontSize(12); 
            doc.setFont("Roboto", "bold");
            const exportNameChart = `Biểu đồ thống kê Top ${limit} ${thongKe.title}`;
            const textWidth = doc.getTextWidth(exportNameChart);
            const xPositionTitle = (pageWidth - textWidth) / 2;
            doc.text(exportNameChart, xPositionTitle, 230); 
        }

        doc.setFontSize(12);
        const exportNameTable = `Bảng Top ${limit} ${thongKe.title}`;
        const textWidthTable = doc.getTextWidth(exportNameTable);
        const xPositionTable = (pageWidth - textWidthTable) / 2;
            doc.text(exportNameTable, xPositionTable, 610); 
            autoTable(doc, {
                startY: 630, 
                head: [["Tên sách", "Tác giả", "Khoa", "Số trang",thongKe.id === 1 ? "Lượt xem" : "Đánh giá trung bình"]],
                body: statisticData.map((book) => [
                    book.title,
                    book.author,
                    book.majors,
                    book.pageNumber,
                    thongKe.id === 1 ? book.totalViews : book.avgRating,
                ]),
                theme: 'grid', 
                styles: {
                    font: 'Roboto', 
                    fontSize: 12, 
                },
                headStyles: {
                    fillColor: [255, 0, 0], 
                    textColor: [255, 255, 255], 
                },
            });

        doc.save("BookStatistics.pdf");

    }

    return (
        <>
        {
            loading && <Loading />
        }
        <CCol>
           <CRow className="d-flex justify-content-center align-items-center gap-4 ">
            
            <CCol xs="auto" className="d-flex align-items-center gap-2">
              <CFormLabel htmlFor="from-date" className="mb-0 text-base font-medium">Từ:</CFormLabel>
              <CFormInput
                type="date"
                id="from-date"
                max={today}
                value={startDate}
                onChange={handleStartDateChange}
                className="border rounded p-2"
              />
            </CCol>
      
            <CCol xs="auto" className="d-flex align-items-center gap-2">
              <CFormLabel htmlFor="to-date" className="mb-0 text-base font-medium">Đến:</CFormLabel>
              <CFormInput
                type="date"
                id="to-date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="border rounded p-2"
              />
            </CCol>
      
            <CCol xs="auto" className="d-flex align-items-center gap-2">
              <CFormLabel htmlFor="genre-select" className="mb-0 text-base font-medium">Khoa:</CFormLabel>
              <CFormSelect
                id="genre-select"
                className="w-40"
                onChange={handleChangeMajors}
              >
                <option value="">Tất cả</option>
                {majors.map((m) => (
                  <option value={m._id} key={m._id}>
                    {m.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
           
          </CRow> 
          <CCol>
        
        <div style={{height:30}}/>

          <CCol xs="auto" className="d-flex align-items-center gap-2">
              <CCol md={2}>
                <CFormLabel htmlFor="genre-select" className="mb-0 text-base font-medium">Loại thống kê:</CFormLabel>
              </CCol>
              <CCol md={6}>
                <CFormSelect
                id="genre-select"
                className="w-10"
                onChange={handleChangeLoaiThongKe}
                >
                {loaiThongKe.map((a) => (
                  <option value={a._id} key={a._id}>
                    {a.title}
                  </option>
                ))}
              </CFormSelect>
              </CCol>
              <div style={{width:30}}/>
              <CFormLabel  className="mb-0 text-base font-medium">Số lượng sách(1-20):</CFormLabel>
              <CCol md={1}>
                <Input 
                value={limit}
                onChange={(e) => handleChange(e)}
                type="number"
                min={1}
                max={20}
                 placeholder="Nhập số lượng sách" />
                </CCol>
            </CCol>
          </CCol>

          <div style={{height:30}}/>

          <CCol xs="auto">
              <CButton
                type="button"
                onClick={() => {
                    handleThongKe();
                }}
                color="success"
                className="px-4 py-2 text-dark font-medium rounded disabled-opacity-50"
                disabled={!startDate || !endDate}
              >
                <span className="text-base text-white">Xem thống kê</span>
              </CButton>
            </CCol>

          <div style={{height:30}}/>

          <CCol xs={12} md={10} style={{margin:'auto'}}>
            <CChartBar
            ref={chartRef}
            lang="vi"
            data={{
                labels: statisticData.map((item) => item.title),
                datasets: [
                    {
                    label: thongKe.title,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: statisticData.map((item) => thongKe.id === 1 ? item.totalViews : item.avgRating),
                    },
                ],
            }}
            options={{
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true, 
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            },
                        },
                    },
                },
            }}
            />
          </CCol>

          <div style={{height:30}}/>

            <CCol xs={12} md={2} style={{marginLeft:'auto'}}>
                <Button onClick={exportToPDF} type="primary" className="w-86">Xuất thống kê</Button>
            </CCol>

                <div style={{height:30}}/>
        </CCol>
        </>
    );
    }
export default StatisticBook;