import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "bootstrap/dist/css/bootstrap.min.css";
import JobsForm from "./JobsForm";
import JobGroupGrid from "./JobGroupGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const Job = ({
  joblist,
  onSelectedRowsChange,
  handleUpdateForm,
  jobgroup,
  handleDeleteJob,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  console.log("the selected rows", selectedRows);

  const [showModal, setShowModal] = useState(false);
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [updatedFormData, setUpdatedFormData] = useState("");
  const [selectDeletedData, setSelectedDeleteData] = useState("");

  console.log("the joblist coming:", joblist);

  useEffect(() => {
    onSelectedRowsChange(selectedRows);
  }, [selectedRows, onSelectedRowsChange]);

  const handleRowSelected = (selectedData) => {
    setSelectedRows(selectedData);
    if (selectedData.length > 0) {
      setSelectedRows(selectedData[0].job_group);
    } else {
      setSelectedRows(null);
    }
    onSelectedRowsChange(selectedRows);
  };

  const handleEyeButtonClick = (row) => {
    setSelectedJobDescription(row.job_description);
  };

  const handleEditClick = (rowData) => {
    setSelectedRowData(rowData);
    setSelectedRows([rowData]);
    setShowModal(true);
  };
  const handleDeleteClick = (rowData) => {
    setSelectedRowData(rowData);
    setSelectedRows([rowData]);
    setShowModal(true);
  };

  const handleGridSelection = (event) => {
    const selectedRows = event.api.getSelectedRows();
    setSelectedRows(selectedRows);
  };

  const ActionsCellRenderer = (props) => (
    <div>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => props.onEditClick(props)}
      >
        Edit
      </button>
      <button
        className="btn btn-danger btn-sm mx-2"
        onClick={() => props.onDeleteClick(props)}
      >
        Delete
      </button>
    </div>
  );

  const handleUpdatedData = (formData) => {
    setUpdatedFormData(formData);
    console.log("Print this:", JSON.stringify(updatedFormData, null, 2));
  };

  const colDefs = [
    { headerName: "Job Name", field: "name" },
    { headerName: "Job Group", field: "job_group", filter: true },
    { headerName: "Department", field: "department", filter: true },
    {
      headerName: "Job Description",
      field: "job_description",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <button
            type="button"
            className="btn btn-link btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#descriptionmodal"
            onClick={() => handleEyeButtonClick(params.data)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      ),
    },
    {
      headerName: "Edit",
      field: "id",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#jobeditmodal"
            onClick={() => handleEditClick(params.data)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      ),
    },
    {
      headerName: "Delete",
      field: "id",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteClick(params.data)}
            data-bs-toggle="modal"
            data-bs-target="#deletemodal"
          >
            <FontAwesomeIcon icon={faTrash} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="row align-items-center">
      <div className="content">
        <div className="container-fluid">
          <div className="ag-theme-quartz" style={{ height: 500 }}>
            <AgGridReact
              rowData={joblist}
              columnDefs={colDefs}
              onSelectionChanged={handleGridSelection}
            />
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="jobeditmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Update Job
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <JobsForm
                rowData={selectedRowData}
                selectedRows={selectedRows}
                onChangeData={handleUpdatedData}
                mode={selectedRowData ? "update" : "create"}
              />
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
                onClick={() => {
                  handleUpdateForm(updatedFormData);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="updatejobdepartmentmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Select Job Group and Department
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <JobGroupGrid
                onRowSelected={handleRowSelected}
                selectedRows={selectedRows}
                jobgroup={jobgroup}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#jobeditmodal"
              >
                Back
              </button>
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
                Delete Job{" "}
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
                onClick={handleDeleteJob}
                data-bs-dismiss="modal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="descriptionmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Job Description{" "}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{selectedJobDescription}</div>
            <div className="modal-footer">
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
    </div>
  );
};

export default Job;
