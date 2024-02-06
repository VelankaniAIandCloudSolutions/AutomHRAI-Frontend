import React,{useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';


function AgGridAttendanceList({ rowData }) {


  const [colDefs, setColDefs] = useState([
    { headerName: 'Employee ID', field: 'employeeID',filter:true },
    { headerName: 'Employee Name', field: 'employeeName',filter:true },
    { headerName: 'Email', field: 'email',width: 250 ,filter:true },
    { headerName: 'Date', field: 'date' , filter:true },
    { headerName: 'CheckIn Time', field: 'checkInTime',width: 150 },
    { headerName: 'CheckOut Time', field: 'checkOutTime',width: 150 },
    { headerName: 'Status', field: 'status',filter:true }
  ]);

  
    console.log('rowData:', rowData);
    console.log('columnDefs:', colDefs);
  
    return (
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    );
  }
  

export default AgGridAttendanceList;