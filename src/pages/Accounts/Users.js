import React, { useState } from "react";
import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
function Users() {
  const [rowData, setRowData] = useState([
    {
      employeeID: "VAC001",
      employeeName: "Soniya",
      email: "soniya.h@velankanigroup.com",
      mobile: 9876543210,
    },
    {
      employeeID: "VAC002",
      employeeName: "Test",
      email: "test@velankanigroup.com",
      mobile: 9087654321,
    },
  ]);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const handleDeleteClick = (props) => {
    setshowDeleteModal(true);
  };
  const handleClose = () => {
    setshowDeleteModal(false);
  };

  function ActionsCellRenderer(props) {
    return (
      <div>
        {/* <button className="btn btn-primary btn-sm" ><i className="fas fa-pen"></i> Edit</button> */}
        <a class="btn btn-primary btn-sm" href="users/edit-user" role="button">
          <i className="fas fa-pen"></i> Edit
        </a>
        <button
          className="btn btn-danger btn-sm mx-2 "
          data-bs-toggle="modal"
          data-bs-target="#deletemodal"
          onClick={() => handleDeleteClick(props)}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    );
  }
  const colDefs = [
    { headerName: "Employee ID", field: "employeeID" },
    { headerName: "Employee Name", field: "employeeName" },
    { headerName: "Email", field: "email", width: 250 },
    { headerName: "Mobile No", field: "mobile" },
    {
      headerName: "Actions",
      //   cellRendererFramework: ActionsCellRenderer,
      width: 300,
      cellRenderer: ActionsCellRenderer,
    },
  ];
  const frameworkComponents = {
    actionsCellRenderer: ActionsCellRenderer,
  };
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-9 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Users</h2>
            <span className="ms-3 fs-4 text-muted">|</span>
            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fas fa-home"></i> Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-users"> </i> Users
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="col-md-3 d-flex justify-content-end mt-4">
          <a class="btn btn-primary" href="users/create-user" role="button">
            <i className="fas fa-user-plus"> </i> Create New User
          </a>
        </div>

        <div className="container" style={{ marginTop: "25px" }}>
          {/* The AG Grid component */}
          <AgGridUserList rowData={rowData} />
        </div>
      </div>

      <div
        class="modal fade"
        id="deletemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Delete User
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Are you sure you want to delete?</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Confirm
              </button>
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
  );
}

export default Users;
