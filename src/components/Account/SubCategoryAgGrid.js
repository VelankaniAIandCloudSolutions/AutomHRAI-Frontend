import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
import SubCategoryForm from "../../components/Account/SubCategoryForm";
function SubCategoryAgGrid({
  rowData,
  onDeleteSubCategory,
  categories,
  handleSubCategoryCreated,
}) {
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("edit");

  const handleDeleteClick = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };
  const handleClose = () => {
    setSelectedSubCategoryId(null);
  };

  const handleConfirmDelete = () => {
    onDeleteSubCategory(selectedSubCategoryId, handleClose);
  };

  function ActionsCellRenderer(props) {
    const history = useHistory();
    console.log(props.data.id);
    const handleEditClick = () => {
      const subCategoryId = props.data.id;
      history.push(`/sub-categories/edit-project/${subCategoryId}`);
    };
    const handleDeleteClickInRenderer = () => {
      const subCategoryId = props.data.id;
      handleDeleteClick(subCategoryId);
    };
    const handleRowClicked = (event) => {
      const rowData = event.data;
      setSelectedSubCategory(rowData);

      setMode("edit");
    };
    const handleEditButtonClick = (event) => {
      const rowData = props.node.data; // Access the row data from the event
      console.log("Row Data:", rowData); // Log the row data
      setSelectedSubCategory(rowData);
      setMode("edit");
    };

    return (
      <div className="p-0">
        {
          <button
            className="btn btn-primary btn-sm "
            data-bs-toggle="modal"
            data-bs-target="#createOrEditModal"
            onClick={handleEditButtonClick}
          >
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
    {
      headerName: "Sub Category Name",
      field: "name",
      width: 300,
      filter: true,
    },

    {
      headerName: "Category",
      field: "category.name",
      width: 300,
      filter: true,
    },

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
        id="createOrEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Sub Category
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <SubCategoryForm
                show={showModal}
                handleClose={() => setShowModal(false)}
                categories={categories} // Pass the array of category objects
                // onSubmit={handleSubmit} // Pass the function to handle form submission
                mode={mode} // Pass the mode of the form
                initialData={selectedSubCategory} // Pass initial data when editing a subcategory
                onSubCategoryCreated={handleSubCategoryCreated} // Pass the function to handle subcategory creation =
              />
            </div>
          </div>
        </div>
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
            <div className="modal-body">
              Are you sure you want to delete this Sub Category?
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

export default SubCategoryAgGrid;
