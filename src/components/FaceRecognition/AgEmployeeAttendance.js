import React,{useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function AgEmployeeAttendance({rowData}) {
    const [colDefs, setColDefs] = useState([
        { headerName: 'Sl No', field: 'id' },
        { headerName: 'Date', field: 'date',filter:true },
        { headerName: 'Check In', field: 'check_in' },
        { headerName: 'Check Out', field: 'check_out' },
        { headerName: 'Break In', field: 'break_in' },
        { headerName: 'Break Out', field: 'break_out' },
        { headerName: 'Worked Hours', field: 'net_working_time' , filter:true },
        { headerName: 'Break', field: 'total_break_time'},
      ]);

      console.log("the row data" , rowData)


    //   const [originalRowData, setOriginalRowData] = useState([
    //     {
    //       employeeID: "VAC001",
    //       email: "soniya@velankanigroup.com",
    //       employeeName: "Soniya",
    //       checkInTime: "08.00 AM",
    //       checkOutTime: "04.00 PM",
    //       date: "2024-02-01",
    //       status: true,
    //     },
    //     {
    //       employeeID: "VAC002",
    //       email: "test@velankanigroup.com",
    //       employeeName: "Test",
    //       checkInTime: "08.00 AM",
    //       checkOutTime: "04.00 PM",
    //       date: "2024-01-31",
    //       status: true,
    //     },
    //   ]);
    
    //   const [rowData, setRowData] = useState(originalRowData);
    

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
  )
}

export default AgEmployeeAttendance
