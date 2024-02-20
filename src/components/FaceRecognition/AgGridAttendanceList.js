import React,{useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';


function AgGridAttendanceList({ rowData }) {


  const [colDefs, setColDefs] = useState([
    { headerName: 'Employee ID', field: 'id', filter: true },
    { headerName: 'Employee Name', field: 'user.name', filter: true },
    { headerName: 'Email', field: 'user.email', width: 250, filter: true },
    { headerName: 'Date', field: 'created_at', filter: true, valueFormatter: formatDate },
    { headerName: 'Check-In Time', field: 'checkin_time', width: 150, valueFormatter: formatTime },
    { headerName: 'Check-Out Time', field: 'checkout_time', width: 150, valueFormatter: formatCheckOutTime },
  ]);
  
  function formatDate(params) {
    if (params.value) {
      const date = new Date(params.value + 'Z'); // Append 'Z' to indicate UTC timezone
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    }
    return '';
  }
  
  function formatTime(params) {
    if (params.value) {
      const time = new Date(params.value + 'Z'); // Append 'Z' to indicate UTC timezone
      return time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return '';
  }
  
  function formatCheckOutTime(params) {
    if (params.value) {
      const time = new Date(params.value + 'Z'); // Append 'Z' to indicate UTC timezone
      return time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return '';
  }
  
  
    return (
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    );
  }
  

export default AgGridAttendanceList;