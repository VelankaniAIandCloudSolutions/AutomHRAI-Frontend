import React, { useState, useEffect } from "react";
import AgEmployeeAttendance from "../../components/FaceRecognition/AgEmployeeAttendance";

function EmployeeAttendance() {
    const [originalRowData, setOriginalRowData] = useState([
        {
          slno:1,
          workedHours: "08",
          checkIn: "08.00 AM",
          checkOut: "04.00 PM",
          date: "2024-02-01",  
        },
        {
          slno:2,
          workedHours: "08",
          checkIn: "08.00 AM",
          checkOut: "04.00 PM",
          date: "2024-02-01", 
        },
      ]);
    
      const [rowData, setRowData] = useState(originalRowData);
      const [selectedMonth, setSelectedMonth] = useState("");
      const [selectedYear, setSelectedYear] = useState("");
      const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
      };
    
      const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
      };
      const handleSearch = () => {
        // Filter the data based on selectedMonth and selectedYear
        const filteredData = originalRowData.filter((item) => {
          const itemDate = new Date(item.date);
          const itemMonth = itemDate.getMonth() + 1; // Months are 0-indexed
          const itemYear = itemDate.getFullYear();
    
          return (
            (selectedMonth === "" || itemMonth.toString() === selectedMonth) &&
            (selectedYear === "" || itemYear.toString() === selectedYear)
          );
        });
    
        setRowData(filteredData);
      };  
    
  return (
    <div className="container">
    <div className="row align-items-center">
      <div className="col-md-9 mt-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Employee Attendance</h2>
          <span className="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" className="d-inline-block ms-3">
            <ol className="breadcrumb bg-transparent m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fas fa-home me-1"></i>Home
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <i className="fas fa-list"> </i> Employee Attendance
              </li>
            </ol>
          </nav>
        </div>
      </div>

      
    </div>
    {/* <div className="col-md-5 d-flex justify-content-end mt-4"> */}
      <div className="row mt-4">
    <div className="col-md-4">

        <select
          className="form-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          <option value="">Select Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
        </select>
</div>
<div className="col-md-4">

        <select
          className="form-select ms-2"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
</div>
<div className="col-md-4">

        <button className="btn btn-primary ms-2" style={{ width: "70%" }} onClick={handleSearch}>
          Search
        </button>
        </div>
        </div>
      {/* </div> */}

    <div className="container" style={{ marginTop: "25px" }}>
      {/* The AG Grid component */}
      {/* <AgGridReact rowData={rowData} columnDefs={colDefs} /> */}
      <AgEmployeeAttendance rowData={rowData} />
    </div>
  </div>
  )
}

export default EmployeeAttendance
