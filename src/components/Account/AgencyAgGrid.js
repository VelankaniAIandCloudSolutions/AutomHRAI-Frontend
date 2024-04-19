import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AgGridComponent = ({ agencyData, onSelectAgency }) => {
  const [selectedAgency, setSelectedAgency] = useState(null);

  const handleAgGridDeleteClick = (agency) => {
    setSelectedAgency(agency);
    onSelectAgency(agency);
  };

  const columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Agency-Id", field: "agency_id" },
    { headerName: "Owner Name", field: "agency_owner" },
    { headerName: "GST", field: "gst" },
    {
      headerName: "Labour License",
      field: "labour_license",
      cellRenderer: (params) => {
        if (params.value) {
          const baseUrl = "http://localhost:8000";
          const fileUrl = `${baseUrl}/${params.value}`;

          return (
            <div style={{ marginLeft: "55px" }}>
              <a
                href={fileUrl}
                target="_blank"
                className="btn btn-primary btn-sm"
                download
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </div>
          );
        } else {
          return (
            <div style={{ marginLeft: "55px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.error("No labour license available");
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          );
        }
      },
    },
    {
      headerName: "PAN",
      field: "pan",
      cellRenderer: (params) => {
        if (params.value) {
          const baseUrl = "http://localhost:8000";
          const fileUrl = `${baseUrl}/${params.value}`;
          return (
            <div style={{ marginLeft: "55px" }}>
              <a
                href={fileUrl}
                target="_blank"
                className="btn btn-primary btn-sm"
                download
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </div>
          );
        } else {
          return (
            <div style={{ marginLeft: "55px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.error("No PAN available");
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          );
        }
      },
    },
    {
      headerName: "W.C.P",
      field: "wcp",
      cellRenderer: (params) => {
        if (params.value) {
          const baseUrl = "http://localhost:8000";
          const fileUrl = `${baseUrl}/${params.value}`;
          return (
            <div style={{ marginLeft: "55px" }}>
              <a
                href={fileUrl}
                target="_blank"
                className="btn btn-primary btn-sm"
                download
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </div>
          );
        } else {
          return (
            <div style={{ marginLeft: "55px" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  toast.error("No W.C.P available");
                }}
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          );
        }
      },
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: (params) => (
        <div>
          <button
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm me-1"
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit
          </button>
          <button
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#deleteAgencyModal" // Corrected modal ID
            onClick={() => handleAgGridDeleteClick(params.data)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="ag-theme-quartz" style={{ height: "500px", width: "100%" }}>
      <AgGridReact
        rowData={agencyData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default AgGridComponent;
