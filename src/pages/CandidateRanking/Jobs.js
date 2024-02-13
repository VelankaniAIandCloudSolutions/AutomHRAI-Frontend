import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import "bootstrap/dist/css/bootstrap.min.css";
import JobsForm from "../../components/CandidateRanking/JobsForm";
import Job from "../../components/CandidateRanking/Job";
import JobGroupGrid from "../../components/CandidateRanking/JobGroupGrid";

const Jobs = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelected = (selectedData) => {
    setSelectedRows(selectedData);
  };

  useEffect(() => {
    console.log("selectedRows in Jobs:", selectedRows);
  }, [selectedRows]);

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Jobs</h2>
            <span className="ms-3 fs-4 text-muted">|</span>
            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fas fa-home me-1"></i>Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-briefcase me-1"></i>
                  Jobs
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#jobmodal"
          >
            Create Job
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: "25px" }}>
        <Job />
      </div>

      <div
        class="modal fade"
        id="jobmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel">
                Create Job
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <JobsForm selectedRows={selectedRows} mode="create" />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="jobdepartmentmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">
                Select Job Group and Department
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <JobGroupGrid
                onRowSelected={handleRowSelected}
                selectedRows={selectedRows}
              />
            </div>

            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#jobmodal"
                data-bs-toggle="modal"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
