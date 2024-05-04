import React, { useState, useRef } from "react";
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
        // Format the date to display in a readable format
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
        dynamicColumns.push({
          headerName: formattedDate,
          field: date,
          width: 120,
          cellRenderer: (params) => {
            const rowData = params.data[date];
            const status = rowData ? rowData.status : "";
            let badgeContent = "";
            let badgeClass = "";
            if (status === "Absent") {
              badgeContent = "A";
              badgeClass = "badge badge-danger"; // Bootstrap class for red badge
            } else if (status === "Present") {
              badgeContent = "P";
              badgeClass = "badge badge-success"; // Bootstrap class for green badge
            }
            return (
              <div>
                <span className={badgeClass}>{badgeContent}</span> -{" "}
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
    ...generateDynamicColumns(rowData),
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-sm btn-secondary mt-3" onClick={handleExportCSV}>
          Export
          <i className="fas fa-download ms-2" />
        </button>
      </div>
      <div className="ag-theme-quartz mt-2" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          onGridReady={onGridReady}
          // Enable CSV Export
        />
      </div>
    </div>
  );
}

export default AgGridMonthlyContractWorkerAttendanceReport;
