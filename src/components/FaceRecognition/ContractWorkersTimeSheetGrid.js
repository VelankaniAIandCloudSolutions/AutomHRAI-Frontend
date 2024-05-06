import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ContractWorkerAttendanceGrid from "./ContractWorkerAttendanceGrid";

const ContractWorkerAgGrid = ({ responseData }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalData, setModalData] = useState(null);

  const columnDefs = [
    {
      headerName: "Date",
      field: "date",
      width: 250,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        }
        return "";
      },
    },
    {
      headerName: "Working Time",
      field: "work_time",
      width: 300,
      valueFormatter: (params) => formatTime(params.value),
    },
    {
      headerName: "Break Time",
      field: "break_time",
      width: 300,
      valueFormatter: (params) => formatTime(params.value),
    },
    {
      headerName: "Attendance List",
      field: "list",
      width: 260,
      cellRenderer: (params) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#imageModal"
          onClick={() => handleViewImage(params.data)}
        >
          <i className="fas fa-eye"></i>
        </button>
      ),
    },
  ];

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) {
      return "-- hr : -- min";
    }
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);

    const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

    const hourSuffix = hours <= 1 ? "hr" : "hrs";
    const minuteSuffix = minutes <= 1 ? "min" : "mins";

    return `${formattedHours} ${hourSuffix} ${formattedMinutes} ${minuteSuffix}`;
  };

  const handleViewImage = (data) => {
    setSelectedRow(data);
  };

  // Transform responseData.user_data into rowData expected by Ag-Grid
  const rowData = responseData?.user_data || [];

  const handleSelectionChange = () => {
    setModalData();
  };

  console.log("Response Data:", responseData);
  const filterEntries = selectedRow?.entries || [];

  console.log("Flattened Entries:", filterEntries);

  return (
    <>
      <div
        className="ag-theme-quartz"
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>

      {/* Image Modal */}
      <div
        className="modal fade"
        id="imageModal"
        tabIndex="-1"
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="imageModalLabel">
                Attendance List
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ContractWorkerAttendanceGrid
                attendanceData={filterEntries}
                onSelectionChange={handleSelectionChange}
                showImgInNewWindow={true}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractWorkerAgGrid;
