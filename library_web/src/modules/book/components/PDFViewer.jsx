import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useLocation, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { _createHistory } from "../api";

export default function PdfViewer() {
  const location = useLocation();
  const book = location.state.book;
  const page = location.state.page;
  const { cPage, setCPage } = useOutletContext();

  const handlePageChange = async (e) => {
    // localStorage.setItem("currentPage", e.currentPage);
    setCPage(e.currentPage);
    await debouncedSave(e.currentPage);
  };

  const debouncedSave = debounce(async (cPage) => {
    console.log("current page", cPage);
    try {
      const history = {
        book: book._id,
        page: cPage,
      };
      const response1 = await _createHistory(history);
      console.log("đã save");
    } catch (error) {
      console.log(error);
    }
  }, 2000);
  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const {
          CurrentPageInput,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;

        return (
          <div style={{ alignItems: "center", display: "flex", width: "100%" }}>
            <div style={{ padding: "0px 2px" }}>
              <ShowSearchPopover />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <ZoomOut />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <Zoom />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <ZoomIn />
            </div>
            <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
              <GoToPreviousPage />
            </div>
            <div
              style={{
                padding: "0px 2px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <CurrentPageInput /> / <NumberOfPages />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <GoToNextPage />
            </div>
            <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
              <EnterFullScreen />
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: () => [],
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div style={{ height: window.innerHeight }} className="pt-2">
        <Viewer
          key={page }
          fileUrl={book.pdfLink}
          plugins={[defaultLayoutPluginInstance]}
          onPageChange={handlePageChange}
          initialPage={page }
        />
      </div>
    </Worker>
  );
}
