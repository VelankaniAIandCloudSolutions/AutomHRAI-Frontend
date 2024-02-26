import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function AgGridJob({ rowData }) {
  const colDefs = [
    {
      headerCheckboxSelection: true, // Enable checkbox selection in the header
      checkboxSelection: true, // Enable checkbox selection for each row
      headerName: "Job Name",
      field: "name",
      filter: true,
    },
    { headerName: "Job Group", field: "job_group", filter: true },
    { headerName: "Department", field: "department", filter: true },
    { headerName: "Job Description", field: "job_description", filter: true },
    { headerName: "Attachments", field: "attachment", filter: true },
  ];

  const gridOptions = {
    rowSelection: "single", // Enable multi-select
    // rowMultiSelectWithClick: true, // Allow multi-select on click
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 300 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        gridOptions={gridOptions}
      />
    </div>
  );
}

export default AgGridJob;
