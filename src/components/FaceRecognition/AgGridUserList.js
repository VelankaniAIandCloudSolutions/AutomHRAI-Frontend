import React,{useState} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function AgGridUserList({ rowData }) {
    const [showDeleteModal, setshowDeleteModal]=useState(false);
    const handleDeleteClick=(props)=>{
        setshowDeleteModal(true);
    }
const handleClose=()=>{
    setshowDeleteModal(false);
}
    function ActionsCellRenderer(props) {
        return (
          <div>
            {/* <button className="btn btn-primary btn-sm" ><i className="fas fa-pen"></i> Edit</button> */}
            <a class="btn btn-primary btn-sm" href="users/edit-user" role="button"><i className="fas fa-pen"></i>  Edit</a>
            <button className="btn btn-danger btn-sm mx-2 " data-bs-toggle="modal" data-bs-target="#deletemodal" onClick={() => handleDeleteClick(props)}><i className="fas fa-trash" ></i> Delete</button>
          </div>
        );
      }
    const colDefs = [
        { headerName: 'Employee ID', field: 'employeeID',filter:true },
        { headerName: 'Employee Name', field: 'employeeName',filter:true },
        { headerName: 'Email', field: 'email', width: 250,filter:true },
        { headerName: 'Mobile No', field: 'mobile',filter:true },
        {
          headerName: 'Actions',
        //   cellRendererFramework: ActionsCellRenderer,
          width: 300,
          cellRenderer: ActionsCellRenderer
        },
      ];
      const frameworkComponents = {
        actionsCellRenderer: ActionsCellRenderer,
      };
  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
    <AgGridReact rowData={rowData} columnDefs={colDefs} frameworkComponents={frameworkComponents}/>
  </div>
  )
}

export default AgGridUserList
