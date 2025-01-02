import Login from "./modules/auth/Login";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "./route/PrivateRoute";
import Home from "./modules/main/Home";
import Register from "./modules/auth/Register";
import AuthLayout from "./modules/auth/AuthLayout";
import Layout from "./components/Layout";
import Genre from "./modules/main/Genre";
import Result from "./modules/main/Result";
import BookLayout from "./modules/book/BookLayout";
import { msalInstance } from "./config/msalConfig";
import { MsalProvider } from "@azure/msal-react";
import BookContent from "./modules/book/BookContent";
import AudioViewer from "./modules/book/components/AudioViewer";
import PdfViewer from "./modules/book/components/PDFViewer";
import UpdateInfoMs from "./modules/auth/components/UpdateInfoMs";
import ResetPass from "./modules/auth/components/ResetPass";
import ForgetPass from "./modules/auth/ForgetPass";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/update-user" element={<UpdateInfoMs />} />
            <Route path="/update-password" element={<ForgetPass />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/genre" element={<Genre />} />
              <Route path="/result" element={<Result />} />
              <Route path="/book" element={<BookLayout />} />
            </Route>
            <Route element={<BookContent />}>
              <Route path="/book-audio" element={<AudioViewer />} />
              <Route path="/book-content" element={<PdfViewer />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;
