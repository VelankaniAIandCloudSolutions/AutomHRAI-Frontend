import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import { toast } from "react-toastify";

function AgGridLocation({ rowData, onRowSelected, onDeleteClick }) {
  const [modalData, setModalData] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedCompany, setEditedCompany] = useState("");

  const handleEditClick = (data) => {
    setModalData(data);
    setEditedName(data.name);
    setEditedCompany(data.company?.name);
  };

  const handleSaveChanges = () => {
    const updatedLocation = {
      name: editedName,
      company: {
        name: editedCompany
      }
    };

    axios.put(`/accounts/locations/update/${modalData.id}/`, updatedLocation)
      .then(response => {
        console.log("Location updated successfully:", response.data);
        window.location.reload();

        toast.success('Location updated successfully');


      })
      .catch(error => {
        console.error("Error updating location:", error);
      });
  };

  const colDefs = [
    { headerName: "Name", field: "name", filter: true },
    { headerName: "Company", field: "company.name", filter: true },
    {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
    },
    // {
    //   headerName: "Delete",
    //   field: "id",
    //   cellRenderer: (params) => (
    //     <div style={{ marginLeft: "55px" }}>
    //       <button
    //         className="btn btn-danger btn-sm"
    //         onClick={() => onDeleteClick(params.data.id)}
    //       >
    //         Delete
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  function ActionsCellRenderer(params) {
    return (
      <div className="p-0">
        <button
          className="btn btn-primary btn-sm mx-2"
          data-bs-toggle="modal"
          data-bs-target="#EditLocationModal"
          onClick={() => handleEditClick(params.data)}
        > 
         <i className="fas fa-pen"></i> Edit
        </button>
        <button
          className="btn btn-danger btn-sm mx-2"
         
          onClick={() => onDeleteClick(params.data.id)}

        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    );
  };
  const gridOptions = {
    rowSelection: "single",
    pagination: true, 
    paginationPageSize: 10, 
  };


  return (
    <>
      <div
        className="modal fade"
        id="EditLocationModal"
        tabIndex="-1"
        aria-labelledby="EditLocationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="EditLocationModalLabel">Edit Location</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="company" className="form-label">Company:</label>
                <input
                  type="text"
                  className="form-control"
                  id="company"
                  value={editedCompany}
                  onChange={(e) => setEditedCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="ag-theme-quartz" style={{ height: 300,  }}>
        <AgGridReact 

          rowData={rowData} 
          columnDefs={colDefs}
          gridOptions={gridOptions}

        />
      </div>
    </>
  );
}

export default AgGridLocation;
