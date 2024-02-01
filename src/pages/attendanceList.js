import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function AttendanceList() {
  const [selectedDate, setSelectedDate] = useState('');
  const [originalRowData, setOriginalRowData] = useState([
    { employeeID: 'VAC001',email:'soniya@velankanigroup.com', employeeName: 'Soniya', checkInTime: '08.00 AM', checkOutTime: '04.00 PM', date: '2024-02-01', status: true },
    { employeeID: 'VAC002',email:'test@velankanigroup.com', employeeName: 'Test', checkInTime: '08.00 AM', checkOutTime: '04.00 PM', date: '2024-01-31', status: true }
  ]);

  const [rowData, setRowData] = useState(originalRowData);

  const [colDefs, setColDefs] = useState([
    { headerName: 'Employee ID', field: 'employeeID' },
    { headerName: 'Employee Name', field: 'employeeName' },
    { headerName: 'Email', field: 'email',width: 250  },
    { headerName: 'Date', field: 'date' },
    { headerName: 'CheckIn Time', field: 'checkInTime',width: 150 },
    { headerName: 'CheckOut Time', field: 'checkOutTime',width: 150 },
    { headerName: 'Status', field: 'status' }
  ]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      const filteredData = originalRowData.filter(item => item.date === formattedDate);
      setRowData(filteredData);
    } else {
      setRowData(originalRowData);
    }
  }, [selectedDate, originalRowData]);

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="col-3">
              <h1>Attendance List</h1>
            </div>
            <div className="col-0">
              <span className="mx-0">|</span>
            </div>
            <div className="col-6">
              <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-list"> </i> Attendance List</li>
                </ol>
              </nav>
            </div>
            <div className='col-3'>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              
            </div>
          </div>

          <div className="ag-theme-quartz" style={{ height: 500 }}>
            {/* The AG Grid component */}
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceList;
