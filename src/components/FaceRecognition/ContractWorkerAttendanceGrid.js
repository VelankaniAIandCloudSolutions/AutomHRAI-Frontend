import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function ContractWorkerAttendanceGrid({ attendanceData }) {
  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "user.first_name", filter: true },
    { headerName: "Agency", field: "user.agency.name", filter: true },
    { headerName: "Attendance Type", field: "type", filter: true },
    { headerName: "Date Time", field: "created_at", filter: true },
    { headerName: "Location", field: "location", filter: true },
    { headerName: "Image", field: "image" },
  ]);
  return (
    <div className="ag-theme-quartz" style={{ height: 550 }}>
      <AgGridReact
        rowData={attendanceData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
      />
    </div>
  );
}
