import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";

function AgGridMonthlyContractWorkerAttendanceReport({
  rowData = [],
  onDeleteContractWorker,
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId);
  };
  const handleClose = () => {
    setSelectedProjectId(null);
  };

  const handleConfirmDelete = () => {
    onDeleteContractWorker(selectedProjectId, handleClose);
  };
  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
    console.log("The rows", selectedRows);
  };

  function ActionsCellRenderer(props) {
    const handleViewClick = () => {
      const rowData = props.data; // Get the row data
      // Pass the rowData to your modal component
      // For simplicity, let's assume you have a function to set modal data
      console.log(" this is the rowDAta being passed in the modal", rowData);
      setModalData(rowData.entries);
    };

    return (
      <div className="p-0">
        <button
          className="btn btn-primary btn-sm"
          onClick={handleViewClick}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>
    );
  }

  const formatTimeFromSeconds = (seconds) => {
    if (seconds === null || isNaN(seconds)) {
      return "-";
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}hrs ${minutes}min`;
    }
  };

  //   const generateDynamicColumns = (data) => {
  //     const dynamicColumns = [];
  //     const dates = Object.keys(data[0]).filter(
  //       (key) =>
  //         key !== "contract_worker_name" &&
  //         key !== "agency" &&
  //         key !== "subcategory"
  //     );
  //     for (const date of dates) {
  //       dynamicColumns.push({
  //         headerName: date,
  //         children: [
  //           {
  //             headerName: "Status",
  //             field: `${date}.status`,
  //             width: 120,
  //             filter: true,
  //           },
  //           {
  //             headerName: "Effective Working Time",
  //             field: `${date}.effective_working_time`,
  //             width: 200,
  //             valueFormatter: ({ value }) => formatTimeFromSeconds(value),
  //           },
  //           {
  //             headerName: "Total Break Time",
  //             field: `${date}.total_break_time`,
  //             width: 180,
  //             valueFormatter: ({ value }) => formatTimeFromSeconds(value),
  //           },
  //         ],
  //       });
  //     }
  //     return dynamicColumns;
  //   };

  //   const generateDynamicColumns = (data) => {
  //     const dynamicColumns = [];
  //     if (data && data.length > 0) {
  //       const dates = Object.keys(data[0]).filter(
  //         (key) =>
  //           key !== "contract_worker_name" &&
  //           key !== "agency" &&
  //           key !== "subcategory"
  //       );
  //       for (const date of dates) {
  //         dynamicColumns.push({
  //           headerName: date,
  //           field: date,
  //           width: 300,
  //           valueFormatter: ({ data }) => {
  //             const rowData = data[date];
  //             return `${rowData ? rowData.status : ""} - ${formatTimeFromSeconds(
  //               rowData ? rowData.effective_working_time : 0
  //             )}`;
  //           },
  //         });
  //       }
  //     }
  //     return dynamicColumns;
  //   };

  const generateDynamicColumns = (data) => {
    const dynamicColumns = [];
    if (data && data.length > 0) {
      const dates = Object.keys(data[0]).filter(
        (key) =>
          key !== "contract_worker_name" &&
          key !== "agency" &&
          key !== "subcategory"
      );
      for (const date of dates) {
        dynamicColumns.push({
          headerName: date,
          field: date,
          width: 300,
          cellRendererFramework: (params) => {
            const rowData = params.data[date];
            const status = rowData ? rowData.status : "";
            let statusColor = "";
            if (status === "Absent") {
              statusColor = "red"; // Change to red for Absent status
            } else if (status === "Present") {
              statusColor = "darkgreen"; // Change to dark green for Present status
            }
            return (
              <div style={{ color: statusColor }}>
                {status.charAt(0)} -{" "}
                {formatTimeFromSeconds(
                  rowData ? rowData.effective_working_time : 0
                )}
              </div>
            );
          },
          autoHeight: true, // To ensure the cell height adjusts based on content
        });
      }
    }
    return dynamicColumns;
  };

  const colDefs = [
    {
      headerName: "Name",
      field: "contract_worker_name", // Update field name to match response JSON
      width: 200,
      filter: true,
    },
    {
      headerName: "Agency",
      field: "agency", // Update field name to match response JSON
      width: 200,
      filter: true,
    },
    {
      headerName: "Subcategory",
      field: "subcategory", // Update field name to match response JSON
      width: 200,
      filter: true,
    },
    ...generateDynamicColumns(rowData),
  ];

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                All Entries
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ContractWorkerAttendanceGrid
                attendanceData={modalData}
                onSelectionChange={handleSelectionChange}
                showImgInNewWindow={true}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmDelete}
                data-bs-dismiss="modal"
              >
                Confirm
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgGridMonthlyContractWorkerAttendanceReport;
