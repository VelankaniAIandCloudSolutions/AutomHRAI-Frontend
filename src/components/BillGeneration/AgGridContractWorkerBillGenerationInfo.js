import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";

function AgGridContractWorkerBillGenerationInfo({
  rowData = [],
  fromDate,
  toDate,
  agencyId,
  onDeleteContractWorker,
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const gridApiRef = useRef(null);

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

  const formatTimeFromSeconds = (seconds) => {
    if (seconds === null || isNaN(seconds)) {
      return "-";
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}hrs ${minutes}min`;
    }
  };

  const handleExportCSV = () => {
    if (gridApiRef.current && rowData && rowData.length > 0) {
      const columnDefs = gridApiRef.current.getColumnDefs();
      const headers = columnDefs.map((colDef) => colDef.headerName);

      const csvData = rowData.map((row) => {
        const rowDataForExport = columnDefs.map((colDef) => {
          const field = colDef.field;
          if (field in row) {
            const value = row[field];
            if (typeof value === "object" && value !== null) {
              return `${value.status} - ${formatTimeFromSeconds(
                value.effective_working_time
              )}`;
            } else {
              return value;
            }
          } else {
            return "";
          }
        });
        return rowDataForExport;
      });

      const csvRows = [headers.join(",")];
      csvData.forEach((row) => {
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          "monthly_contract_worker_attendance_report.csv"
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const onGridReady = (params) => {
    gridApiRef.current = params.api; // Store grid API reference
  };

  const handleViewClick = async (workerId) => {
    try {
      // Assuming you have fromDate and toDate in state or local variables

      // Example API call using axios
      const response = await axios.get(`/api/contract_workers/${workerId}`, {
        data: {
          fromDate,
          toDate,
          agencyId,
        },
      });

      setModalData(response.data);
    } catch (error) {
      console.error("Error fetching contract worker details", error);
    }
  };

  const colDefs = [
    {
      headerName: "id",
      field: "worker_id", // Update field name to match response JSON
      width: 100,
      filter: true,
      hide: false,
    },
    {
      headerName: "Name",
      field: "contract_worker_name", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Agency",
      field: "agency", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Subcategory",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },

    {
      headerName: "Hourly Rate",
      field: "hourly_rate",
      width: 140,
      filter: true,
      cellRenderer: (params) => `₹${params.value}/hr`, // Add rupee symbol and "/hr"
    },
    {
      headerName: "Working Hours",
      field: "total_normal_shift_hours",
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
      field: "total_extra_shift_hours",
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
      field: "total_working_bill",
      width: 140,
      filter: true,
      cellRenderer: (params) => `₹${params.value}`, // Add rupee symbol
    },
    {
      headerName: "Extra Bill",
      field: "total_extra_bill",
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
    {
      headerName: "View Details",
      field: "list",
      width: 260,
      cellRenderer: (params) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => handleViewClick(params.data.worker_id)}
        >
          <i className="fas fa-eye"></i>
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
      <div className="ag-theme-quartz mt-2" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          // Enable CSV Export
        />
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
    </div>
  );
}

export default AgGridContractWorkerBillGenerationInfo;
