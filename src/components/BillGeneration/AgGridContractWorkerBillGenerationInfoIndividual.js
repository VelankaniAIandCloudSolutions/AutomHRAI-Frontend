import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// import ContractWorkerAttendanceGrid from "../FaceRecognition/ContractWorkerAttendanceGrid";
// import AgGridContractWorkerAttendanceDetailsDateWise from "./AgGridContractWorkerAttendanceDetailsDateWise";

import axios from "axios";

const AgGridContractWorkerBillGenerationInfoIndividual = ({ billData }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalData, setModalData] = useState(null);

  const columnDefs = [
    {
      headerName: "id",
      field: "worker_id", // Update field name to match response JSON
      width: 100,
      filter: true,
      hide: false,
    },

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
      headerName: "Working Hours",
      field: "normal_shift_hours",
      width: 140,
      filter: true,
      cellRenderer: (params) => {
        const totalSeconds = params.value * 3600;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      },
    },
    {
      headerName: "Extra Hours",
      field: "extra_shift_hours",
      width: 140,
      filter: true,
      cellRenderer: (params) => {
        const totalSeconds = params.value * 3600;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      },
    },
    {
      headerName: "Total Hours",
      field: "total_hours",
      width: 140,
      filter: true,
      cellRenderer: (params) => {
        const totalSeconds = params.value * 3600;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`;
      },
    },
    {
      headerName: "Working Bill",
      field: "working_bill",
      width: 140,
      filter: true,
      cellRenderer: (params) => `₹${params.value}`, // Add rupee symbol
    },
    {
      headerName: "Extra Bill",
      field: "extra_bill",
      width: 140,
      filter: true,
      cellRenderer: (params) => `₹${params.value}`, // Add rupee symbol
    },
    {
      headerName: "Total Bill",
      field: "total_bill",
      width: 140,
      filter: true,
      cellRenderer: (params) => `₹${params.value}`, // Add rupee symbol
    },

    // {
    //   headerName: "Attendance List",
    //   field: "list",
    //   width: 260,
    //   cellRenderer: (params) => (
    //     <button
    //       type="button"
    //       className="btn btn-primary btn-sm"
    //       // data-bs-toggle="modal"
    //       // data-bs-target="#imageModal"
    //       onClick={() => handleViewAttendanceList(params.data)}
    //     >
    //       <i className="fas fa-eye"></i>
    //     </button>
    //   ),
    // },
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

  const handleViewAttendanceList = (data) => {
    // Make API request
    axios
      .post(
        "/facial-recognition/get_contract_worker_attendance_for_bill_for_specific_date/",
        {
          user_id: data.worker_id,
          date: data.date, // Assuming `data.date` is already in YYYY-MM-DD format
        }
      )
      .then((response) => {
        console.log(response.data);
        // setModalData(response.data); // Assuming the response data is an array of attendance entries
        // Open your modal here (if not already open)
        // Example: $('#imageModal').modal('show');
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
        // Handle error
      });
  };

  // Transform responseData.user_data into rowData expected by Ag-Grid
  const rowData = billData || [];

  const handleSelectionChange = () => {
    setModalData();
  };

  console.log("bill Data:", billData);
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
              {/* <ContractWorkerAttendanceGrid
                attendanceData={filterEntries}
                onSelectionChange={handleSelectionChange}
                showImgInNewWindow={true}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgGridContractWorkerBillGenerationInfoIndividual;
