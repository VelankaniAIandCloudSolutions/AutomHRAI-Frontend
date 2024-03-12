import React, { useState, useRef, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import JobsForm from "../../components/CandidateRanking/JobsForm";
import Job from "../../components/CandidateRanking/Job";
import JobGroupGrid from "../../components/CandidateRanking/JobGroupGrid";
import axios from "axios";

import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

const Jobs = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [selectedRows, setSelectedRows] = useState([]);
  const [joblist, setjobslist] = useState([]);
  const [jobgroup, setjobgroup] = useState([]);
  const [parentSelectedRows, setParentSelectedRows] = useState([]);

  const handleRowSelected = (selectedData) => {
    setSelectedRows(selectedData);
  };

  const fetchJobGroups = async () => {
    try {
      const response = await axios.get("candidate-ranking/jobgroup_list/");
      console.log(response.data);
      setjobgroup(response.data);
    } catch (error) {
      console.error("Error fetching Jobgroups:", error);
    }
  };
  useEffect(() => {
    fetchJobGroups();
  }, []);

  const handleSelectedRowsChange = (selectedRows) => {
    setParentSelectedRows(selectedRows);
    console.log(parentSelectedRows);
  };

  const handleUpdateForm = async (formData) => {
    console.log("This is updatedData", formData);
    const jobId = parentSelectedRows[0].id;
    console.log("ID:", jobId);

    try {
      const response = await axios.put(
        `candidate-ranking/update_job/${jobId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Job Updated successfully:", response.data);
      toast.warn("Job Updated successfully");
      // window.location.reload();

      console.log("Response from update job API:", response.data);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Error occured. Please try again.");
    }
  };

  const fetchJobs = async () => {
    dispatch(showLoading());
    try {
      const response = await axios.get("candidate-ranking/get_jobs/");
      console.log("the jobs data", response.data);
      setjobslist(response.data);
      dispatch(hideLoading());
    } catch (error) {
      console.error("Error fetching Jobgroups:", error);
      dispatch(hideLoading());
    }
  };
  const handleCreateJob = async (formData) => {
    const job_group_id = selectedRows[0].id;

    try {
      const response = await axios.post(
        `candidate-ranking/create_job/${job_group_id}/`,
        formData
      );
      console.log("Job created successfully:", response.data);
      toast.success("Job Created Successfully ");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Failed to create job");
    }
  };

  const handleFormSubmit = (formData) => {
    console.log("Form data submitted in parent:", formData);
    handleCreateJob(formData);
  };

  const handleDeleteJob = async () => {
    const jobId = parentSelectedRows[0].id;
    console.log("DELETE ID:", jobId);

    try {
      const response = await axios.delete(
        `candidate-ranking/delete_job/${jobId}/`
      );
      console.log("Job deleted successfully:", response.data);
      toast.error("Job deleted successfully", {
        icon: <i className="fas fa-check" color="#fff"></i>,
      });
      fetchJobs();
      // window.location.reload();
    } catch (error) {
      console.log("Error deleting job:", error);
      toast.error("Error occured. Please try again.");
    }
  };

  useEffect(
    () => {
      fetchJobs();
      console.log("selectedRows in Jobs:", selectedRows);
    },
    [selectedRows],
    []
  );

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
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

            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#jobmodal"
              >
                Create Job
              </button>
            </div>

            <div className="container" style={{ marginTop: "25px" }}>
              <Job
                joblist={joblist}
                onSelectedRowsChange={handleSelectedRowsChange}
                handleUpdateForm={handleUpdateForm}
                jobgroup={jobgroup}
                handleDeleteJob={handleDeleteJob}
              />
            </div>
          </div>
          <div
            className="modal fade"
            id="jobmodal"
            aria-hidden="true"
            aria-labelledby="exampleModalToggleLabel"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                    Create Job
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
                    selectedRows={selectedRows}
                    mode="create"
                    onFormSubmit={handleFormSubmit}
                  />
                </div>
                {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>
                Save
              </button>
            </div> */}
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="jobdepartmentmodal"
            aria-hidden="true"
            aria-labelledby="exampleModalToggleLabel2"
            tabindex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id="exampleModalToggleLabel2"
                  >
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
                    data-bs-target="#jobmodal"
                    data-bs-toggle="modal"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;
