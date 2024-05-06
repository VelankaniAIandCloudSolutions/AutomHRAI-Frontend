import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
function AgGridUserList({ rowData, onDeleteUser }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
  };
  const handleClose = () => {
    setSelectedUserId(null);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(selectedUserId, handleClose);
  };

  function ActionsCellRenderer(props) {
    const history = useHistory();
    console.log(props.data.id);
    const handleEditClick = () => {
      const userId = props.data.id;
      history.push(`/users/edit-user/${userId}`);
    };
    const handleDeleteClickInRenderer = () => {
      const userId = props.data.id;
      handleDeleteClick(userId);
    };

    return (
      <div className="p-0">
        {
          <button className="btn btn-primary btn-sm " onClick={handleEditClick}>
            <i className="fas fa-pen"></i> Edit
          </button>
        }
        <button
          className="btn btn-danger btn-sm mx-2"
          data-bs-toggle="modal"
          data-bs-target="#deletemodal"
          onClick={handleDeleteClickInRenderer}
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    );
  }

  const colDefs = [
    { headerName: "Employee ID", field: "emp_id", filter: true },
    { headerName: "Employee Name", field: "employeeName", filter: true },
    { headerName: "Email", field: "email", width: 250, filter: true },
    { headerName: "Mobile No", field: "phone_number", filter: true },
    { headerName: "Is Active", field: "is_active", filter: true },
    {
      field: "id",
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
    },
  ];

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>

      <div
        className="modal fade"
        id="deletemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete User
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to delete?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmDelete}
                data-bs-dismiss="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgGridUserList;
