import React, { useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";

function AgGridContractWorkerBillGenerationInfo({
  rowData = [],
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

  const colDefs = [
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
      headerName: "Worked Hours",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Extra Hours",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Total Hours",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Working Bill",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Working Bill",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Extra Bill",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
    },
    {
      headerName: "Total Bill",
      field: "subcategory", // Update field name to match response JSON
      width: 140,
      filter: true,
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
          data-bs-target="#imageModal"
          onClick={() => handleViewImage(params.data)}
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
      </div>
    </div>
  );
}

export default AgGridContractWorkerBillGenerationInfo;
