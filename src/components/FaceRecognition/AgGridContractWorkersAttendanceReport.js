import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
function AgGridUserList({ rowData, onDeleteContractWorker }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId);
  };
  const handleClose = () => {
    setSelectedProjectId(null);
  };

  const handleConfirmDelete = () => {
    onDeleteContractWorker(selectedProjectId, handleClose);
  };

  function ActionsCellRenderer(props) {
    const history = useHistory();
    console.log(props.data.id);
    const handleEditClick = () => {
      const projectId = props.data.id;
      history.push(`/projects/edit-project/${projectId}`);
    };
    const handleDeleteClickInRenderer = () => {
      const projectId = props.data.id;
      handleDeleteClick(projectId);
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
    { headerName: "Employee Name", field: "name", filter: true },
    { headerName: "Email", field: "email", width: 250, filter: true },
    { headerName: "Date", field: "date", filter: true },
    { headerName: "Check-In Time", field: "checkin_time", width: 150 },
    { headerName: "Check-Out Time", field: "checkout_time", width: 150 },

    {
      field: "id",
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
    },
  ];

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
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
