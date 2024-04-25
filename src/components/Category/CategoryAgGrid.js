import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import axios from "axios";
import { toast } from "react-toastify";

function AgGridCategory({
  rowData,
  onDeleteClick,
  fetchCategory,
}) {
  const [categoryData, setCategoryData] = useState(null);
  const [editedName, setEditedName] = useState("");

  const handleEditCategory = (data) => {
    setCategoryData(data);
    setEditedName(data.name);
  };

  const handleSaveChanges = () => {
    const updatedCategory = {
      name: editedName,
    };

    axios
      .put(`/accounts/categories/update/${categoryData.id}/`, updatedCategory)
      .then((response) => {
        fetchCategory();
        toast.success("Category updated successfully");
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        toast.error("Error updating category");
      });
  };

  const handleDeleteCategory = () => {
    axios
      .delete(`/accounts/categories/delete/${categoryData.id}/`)
      .then((response) => {
        fetchCategory();
        toast.success("Category deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        toast.error("Error deleting category");
      });
  };

  const colDefs = [
    { headerName: "Name", field: "name", filter: true },
    {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
    },
  ];

  function ActionsCellRenderer(params) {
    return (
      <div className="p-0">
        <button
          className="btn btn-primary btn-sm mx-2"
          data-bs-toggle="modal"
          data-bs-target="#EditCategoryModal"
          onClick={() => handleEditCategory(params.data)}
        >
          <i className="fas fa-pen"></i> Edit
        </button>
        <button
          className="btn btn-danger btn-sm mx-2"
          data-bs-toggle="modal"
          data-bs-target="#DeleteCategoryModal"
          onClick={() => setCategoryData(params.data)} // Store category data
        >
          <i className="fas fa-trash"></i> Delete
        </button>
      </div>
    );
  }

  const gridOptions = {
    rowSelection: "single",
    pagination: true,
    paginationPageSize: 10,
  };

  return (
    <div className="container">
      <div className="ag-theme-quartz" style={{ height: 300 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          gridOptions={gridOptions}
        />
      </div>

      {/* Edit Category Modal */}
      <div
        className="modal fade"
        id="EditCategoryModal"
        tabIndex="-1"
        aria-labelledby="EditCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="EditCategoryModalLabel">
                Edit Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              </div>
            </div>
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
                data-bs-dismiss="modal"
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Category Modal */}
      <div
        className="modal fade"
        id="DeleteCategoryModal"
        tabIndex="-1"
        aria-labelledby="DeleteCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="DeleteCategoryModalLabel">
                Delete Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete the category:{" "}
              {categoryData && categoryData.name}?
            </div>
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
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgGridCategory;
