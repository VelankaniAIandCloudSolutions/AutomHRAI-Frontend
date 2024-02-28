import React, { useState, useEffect } from "react";
// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import JobGroupsForm from "../../components/CandidateRanking/JobGroupForm";
import JobGroup from "../../components/CandidateRanking/JobGroup";
import DepartmentGrid from "../../components/CandidateRanking/DepartmentGrid";

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Jobgroups = () => {
  const [rowData, setRowData] = useState([
    { department_name: "AI and Cloud Solutions", company: "Velankani" },
    { department_name: "Electronics", company: "Infosys" },
  ]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteRows, setDeleteRows] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobgroups, setjobgroups] = useState([]);
  const [jobGroup, setJobGroup] = useState("");

  const handleRowSelected = (selectedData) => {
    setSelectedRows(selectedData);
  };
  const handleSelectedRows = (selectedRows) => {
    console.log("Selected Rows:", selectedRows);
    setDeleteRows(selectedRows);
    setSelectedRows(selectedRows);
  };
  const handleJobGroupChange = (formData) => {
    setJobGroup(formData.name);
  };

  const fetchJobGroups = async () => {
    try {
      const response = await axios.get("candidate-ranking/jobgroup_list/");
      console.log(response.data);
      setjobgroups(response.data);
    } catch (error) {
      console.error("Error fetching Jobgroups:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("candidate-ranking/department_list/");
      console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchJobGroups();

  }, []);

  const handleJobGroupSave = () => {
    const department_id = selectedRows.length > 0 ? selectedRows[0].id : null;


    if (department_id) {
      axios
        .post(
          `candidate-ranking/create_job_group/${department_id}/`,
          {
            name: jobGroup,
            
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("JobGroup created successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error creating JobGroup:", error);
        });
    } else {
      console.error("No department selected.");
    }
  };

  const handleUpdateJobGroup = (jobGroup) => {
    console.log("Coming jobGroup:", jobGroup);
    const jobGroupId = jobGroup.id;
    console.log("Coming jobGroupId:", jobGroupId, jobGroup.department_id);

    if (jobGroupId) {
      axios
        .put(`candidate-ranking/update_job_group/${jobGroupId}/`, {
          name: jobGroup.name,
          id: jobGroup.department_id,
        })
        .then((response) => {
          console.log("JobGroup updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating JobGroup:", error);
        });
    } else {
      console.error("No JobGroup selected.");
    }
  };

  const handleDeleteJobGroup = () => {
    const jobGroupId = deleteRows.length > 0 ? deleteRows[0].id : null;

    if (jobGroupId) {
      axios
        .delete(`candidate-ranking/delete_job_group/${jobGroupId}/`)
        .then((response) => {
          console.log("JobGroup Deleted successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating JobGroup:", error);
        });
    } else {
      console.error("No jobGroup Selected");
    }
  };

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Job Groups</h2>
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
                  Job-Groups
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-end mt-4">
          <button
            className="btn btn-primary btn-sm ms-2"
            data-bs-toggle="modal"
            data-bs-target="#jobgroupmodal"
          >
            Create Job Group
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: "25px" }}>
        <JobGroup
          rowData={rowData}
          handleUpdateJobGroup={handleUpdateJobGroup}
          departments={departments}
          jobgroups={jobgroups}
          handleSelectedRows={handleSelectedRows}
          handleDeleteJobGroup={handleDeleteJobGroup}
        />
      </div>

      <div
        className="modal fade"
        id="jobgroupmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div className="modal-dialog  modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Create Job Group
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <JobGroupsForm selectedRows={selectedRows} mode="create" onJobGroupChange={handleJobGroupChange}
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
                onClick={handleJobGroupSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Modal */}

      <div
        className="modal fade"
        id="departmentmodal"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Select Department
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <DepartmentGrid
                onRowSelected={handleRowSelected}
                departments={departments}
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#jobgroupmodal"
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

export default Jobgroups;
