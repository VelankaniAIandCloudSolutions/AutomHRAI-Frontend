import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function AgGridLocation({ rowData, onRowSelected, onDeleteClick }) {
  const colDefs = [
    { headerName: "Name", field: "name", filter: true },
    { headerName: "Company", field: "company.name", filter: true},
    {
      headerName: "Delete",
      field: "id",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteClick(params.data.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  const gridOptions = {
    rowSelection: "single",
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 300 , width : 600 , marginLeft : 250 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        gridOptions={gridOptions}
      />
    </div>
  );
}

export default AgGridLocation;
