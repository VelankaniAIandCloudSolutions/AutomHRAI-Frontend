import React,{useState} from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {Modal,Button} from 'react-bootstrap';
import AgGridUserList from '../components/FaceRecognition/AgGridUserList';
function Users() {
    const [rowData, setRowData] = useState([
        { employeeID: "VAC001", employeeName: "Soniya", email: "soniya.h@velankanigroup.com",mobile:9876543210 },
        { employeeID: "VAC002", employeeName: "Test", email: "test@velankanigroup.com",mobile:9087654321 }
    ]);    
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
        { headerName: 'Employee ID', field: 'employeeID' },
        { headerName: 'Employee Name', field: 'employeeName' },
        { headerName: 'Email', field: 'email', width: 250 },
        { headerName: 'Mobile No', field: 'mobile' },
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
    <div className="content-wrapper">
      <div className="content">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="col-1">
              <h1>Users</h1>
            </div>
            <div className="col-0">
              <span className="mx-3">|</span>
            </div>
            <div className="col-9">
              <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-users"> </i> Users</li>
                </ol>
              </nav>
            </div>
            <div className='col-2'>
            <a class="btn btn-primary" href="users/create-user" role="button"><i className="fas fa-user-plus"> </i> Create New User</a>
            </div>
          </div>

          <div className="ag-theme-quartz" style={{ height: 500 }}>
            {/* The AG Grid component */}
            {/* <AgGridReact rowData={rowData} columnDefs={colDefs} frameworkComponents={frameworkComponents}  /> */}
            <AgGridUserList rowData={rowData} />
          </div>
        </div>
      </div>


  <div class="modal fade" id="deletemodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Delete User</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      Are you sure you want to delete?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</div>

      {/* <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" >
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}

    </div>
  )
}

export default Users


