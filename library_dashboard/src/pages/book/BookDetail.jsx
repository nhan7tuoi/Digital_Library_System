import { CButton, CCol, CRow, CContainer } from "@coreui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { _getBookById } from "./apis";
import { Spin } from "antd";

const BookDetail = () => {
    const location = useLocation();
    const { state } = location || {};
    const { data } = state || {};
    const navigate = useNavigate();
    const [book, setBook] = useState({});
    console.log("BookDetail -> book", data?.bookId);

    useEffect(() => {
        if (data?.bookId) {
            getBook(data.bookId);
        }
    }, [data]);

    const getBook = async (id) => {
        try {
            const response = await _getBookById(id);
            if (response.data) {
                setBook(response.data);
            }
        } catch (error) {
            console.error("Error fetching book:", error);
            navigate("/error", { state: { message: "Failed to load book details" } });
        }
    };

    return (
        <CContainer>
            {/* Back Button */}
            <CButton
                color="secondary"
                onClick={() => navigate(-1)}
                style={{ marginBottom: "20px" }}
            >
                Quay lại
            </CButton>
            <div
                className="book-detail-box"
                style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <CRow>
                    <CCol sm={5} className="text-center">
                        {book.image ? (
                            <img
                                src={book.image}
                                alt={book.title || "Book Cover"}
                                width="100%"
                                style={{ maxWidth: "300px", borderRadius: "10px",border: "1px solid #ddd" }}
                            />
                        ) : (
                            <Spin size="large"/>
                        )}
                    </CCol>
                    <CCol sm={7} style={{ padding: "20px" }}>
                        <h1>{book.title || "Title not available"}</h1>
                        <p><strong>Tác giả:</strong> {book.author || "Unknown"}</p>
                        <p><strong>Nhà xuất bản:</strong> {book.publisher || "Unknown"}</p>
                        <p><strong>Năm xuất bản:</strong> {book.yob || "Not provided"}</p>
                        <p><strong>Thể loại:</strong> {book.genre || "Not provided"}</p>
                        <p><strong>Tóm tắt:</strong> {book.summary || "Not provided"}</p>
                    </CCol>
                </CRow>
            </div>
        </CContainer>
    );
};

export default BookDetail;
