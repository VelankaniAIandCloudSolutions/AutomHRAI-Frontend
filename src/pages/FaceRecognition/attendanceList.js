import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import AgGridAttendanceList from "../../components/FaceRecognition/AgGridAttendanceList";

function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState("");
  const [originalRowData, setOriginalRowData] = useState([
    {
      employeeID: "VAC001",
      email: "soniya@velankanigroup.com",
      employeeName: "Soniya",
      checkInTime: "08.00 AM",
      checkOutTime: "04.00 PM",
      date: "2024-02-01",
      status: true,
    },
    {
      employeeID: "VAC002",
      email: "test@velankanigroup.com",
      employeeName: "Test",
      checkInTime: "08.00 AM",
      checkOutTime: "04.00 PM",
      date: "2024-01-31",
      status: true,
    },
  ]);

  const [rowData, setRowData] = useState(originalRowData);

  // const [colDefs, setColDefs] = useState([
  //   { headerName: "Employee ID", field: "employeeID", filter: true },
  //   { headerName: "Employee Name", field: "employeeName", filter: true },
  //   { headerName: "Email", field: "email", width: 250, filter: true },
  //   { headerName: "Date", field: "date", filter: true },
  //   { headerName: "CheckIn Time", field: "checkInTime", width: 150 },
  //   { headerName: "CheckOut Time", field: "checkOutTime", width: 150 },
  //   { headerName: "Status", field: "status", filter: true },
  // ]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
      const filteredData = originalRowData.filter(
        (item) => item.date === formattedDate
      );
      setRowData(filteredData);
    } else {
      setRowData(originalRowData);
    }
  }, [selectedDate, originalRowData]);

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-9 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Attendance List</h2>
            <span className="ms-3 fs-4 text-muted">|</span>
            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fas fa-home me-1"></i>Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-list"> </i> Attendance List
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="col-md-3 d-flex justify-content-end mt-4">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="container" style={{ marginTop: "25px" }}>
        {/* The AG Grid component */}
        {/* <AgGridReact rowData={rowData} columnDefs={colDefs} /> */}
        <AgGridAttendanceList rowData={rowData} />
      </div>
    </div>
  );
}

export default AttendanceList;
