import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function ContractWorkerAttendanceGrid({ attendanceData }) {
  const [colDefs, setColDefs] = useState([
    { headerName: "Name", field: "user.full_name", filter: true },
    { headerName: "Agency", field: "user.agency.name", filter: true },
    { headerName: "Attendance Type", field: "type", filter: true },
    { headerName: "Date Time", field: "created_at", filter: true },
    { headerName: "Location", field: "location.name", filter: true },
    {
      headerName: "Image",
      field: "image",
    },
  ]);

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 550 }}>
        <AgGridReact
          rowData={attendanceData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>
      <div
        className="modal fade"
        id="imageModal"
        tabIndex="-1"
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="imageModalLabel">
                Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <img id="modalImage" className="img-fluid" alt="Attendance" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
