import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ResumeGrid from "../../components/ResumeParsing/ResumeGrid.js";
import ShowParseResumes from "../../components/ResumeParsing/ShowParsedResumes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch,useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

import ResumeEditForm from "../../components/ResumeParsing/ResumeEditForm";

const GridComponent = ({ joblist }) => {
  const dispatch=useDispatch();
  const loading=useSelector(state=>state.loading.loading)
  const [rowData, setRowData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showParseResumesData, setShowParseResumesData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [jobslist, setjobslist] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJobName, setSelectedJobName] = useState("");
  const [resumeIdToDelete, setResumeIdToDelete] = useState(null);
  const [editedRow, setEditedRow] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("candidate-ranking/get_jobs/");
      console.log("the jobs data", response.data);
      setjobslist(response.data);
    } catch (error) {
      console.error("Error fetching Jobgroups:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpload = async () => {
    if (Array.isArray(selectedFiles) && selectedFiles.length > 0) {
      const formData = new FormData();

      console.log("the files:", selectedFiles);
      selectedFiles.forEach((file) => {
        formData.append("resumes", file);
      });

      try {
        const response = await axios.post(
          "resume-parser/file_upload_view/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const parsedData = response.data.resumes.map(
          (resume) => resume.parsed_data
        );
        setShowParseResumesData(parsedData);
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error("Error occured. Please try again.");
      }
    } else {
      console.warn("No files selected for upload.");
    }
  };
  console.log("The resume data is:", showParseResumesData);

  const handleUpdateData = async (updatedResumes) => {
    console.log(updatedResumes);

    setEditedData(updatedResumes);
  };
  const handleEdit = async (editData) => {
    console.log("this is ParamsData:", editData);
    setEditedRow(editData);
  };
  console.log("this is editedData:", editedRow);

  const saveUpdatedResumes = async (updatedResumes) => {
    try {
      console.log("Type of updatedResumes:", typeof updatedResumes);
      console.log("Content of updatedResumes:", updatedResumes);
      if (Array.isArray(updatedResumes)) {
        const cleanData = updatedResumes.map(
          ({
            id,
            name,
            email,
            mobile_number,
            education,
            skills,
            college_name,
            company_name,
            experience,
            total_experience,
          }) => ({
            id,
            name,
            email,
            mobile_number,
            education,
            skills,
            college_name,
            company_name,
            experience,
            total_experience,
          })
        );
        const payload = {
          updated_resumes: cleanData,
        };

        console.log("Edited Data:", payload);

        const response = await axios.put(
          "resume-parser/update_multiple_resumes/",
          payload
        );

        console.log("Resumes updated successfully:", response.data);
        toast.warn('Resumes updated successfully');
        fetchResumes();

        setEditedData([]);
      } else {
        console.error("Updated Resumes is not an array:", updatedResumes);
        toast.error("Error occured. Please try again.");
      }
    } catch (error) {
      console.error("Error updating resumes:", error);
      toast.error("Error occured. Please try again.");
    }
  };
  const handleSaveChanges = () => {
    saveUpdatedResumes(editedData);
  };

  const handleDelete = (resumeId) => {
    axios
      .delete(`resume-parser/delete_resume/${resumeId}/`)
      .then(() => {
        console.log(`Resume with ID ${resumeId} deleted successfully`);
        toast.error('Resumes deleted successfully',{icon: <i className="fas fa-check" color="#fff"></i>});
        fetchResumes();
      })
      .catch((error) => {
        console.error("Error deleting resume:", error);
        toast.error("Error occured. Please try again.");
      });
  };

  const fetchResumes = () => {
    dispatch(showLoading());
    axios
      .get("resume-parser/get_resumes/")
      .then((response) => {
        setRowData(response.data);
        dispatch(hideLoading());
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
        dispatch(hideLoading());
      });
  };

  const handleDeleteClick = (resumeId) => {
    setResumeIdToDelete(resumeId);
  };

  const handleConfirmDelete = () => {
    if (resumeIdToDelete) {
      handleDelete(resumeIdToDelete);
      setResumeIdToDelete(null);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const DeleteButtonRenderer = (props) => {
    return (
      <button
        className="btn btn-outline-danger mb-1"
        data-bs-toggle="modal"
        data-bs-target="#resumedeletemodal"
        onClick={() => handleDeleteClick(props.data.id)}
      >
        Delete
      </button>
    );
  };

  const handleJobChange = (e) => {
    const selectedJobName = e.target.value;

    const selectedJobObject = jobslist.find(
      (job) => job.name === selectedJobName
    );

    const selectedId = selectedJobObject?.id;

    setSelectedJobId(selectedId);
    setSelectedJobName(selectedJobName);

    console.log("Selected Job ID:", selectedId);
  };

  const createCandidate = async () => {
    const resumeId = showParseResumesData[0].id;
    const jobId = selectedJobId;
    console.log(selectedJobId, resumeId);
    try {
      const response = await axios.post(
        `/resume-parser/create_candidate/${resumeId}/${jobId}/`
      );

      console.log("Candidate created successfully:", response.data);
    } catch (error) {
      console.error("Error creating candidate:", error);
    }
  };

  const handleDownloadResume = async (resumeId) => {
    try {
      const response = await axios.get(
        `resume-parser/download_resume/${resumeId}/`,
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `resume_${resumeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Error downloading resume:", response);
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log("Received Form Data in Parent:", formData);
    try {
      const response = await axios.put(
        `resume-parser/update_resume/${formData.id}/`,
        {
          updated_data: formData,
        }
      );

      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Email", field: "email" },
    { headerName: "Mobile No", field: "mobile_number" },
    { headerName: "Qualification", field: "education" },
    { headerName: "Skills", field: "skills" },
    { headerName: "College Name", field: "college_name" },
    { headerName: "Company Name", field: "company_name" },
    { headerName: "Experience", field: "experience" },
    { headerName: "Total Experience", field: "total_experience" },
    {
      headerName: "Download Resume",
      field: "resume",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <a
            href={params.data.resume_file_path}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-sm"
            download={`resume_${params.data.id}.pdf`}
            // onClick={() => handleDownloadResume(params.data.id)}
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>

          {/* <a
                href={params.data.resume.resume_file_path}
                target="_blank"
                className="btn btn-success btn-sm"
                download={`resume_${params.data.id}.pdf`}
              >
                <FontAwesomeIcon icon={faDownload} />
              </a> */}
        </div>
      ),
    },
    {
      headerName: "Edit",

      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px" }}>
          <a
            href={params.value}
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#resumeeditmodal"
            onClick={() => handleEdit(params.data)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </a>
        </div>
      ),
    },
    {
      headerName: "Actions",
      field: "id",
      cellRenderer: DeleteButtonRenderer,
    },
  ];

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
      <div className="row align-items-center">
      <div className="col-md-9 mt-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Resume List</h2>
          <span className="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" className="d-inline-block ms-3">
            <ol className="breadcrumb bg-transparent m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fas fa-home me-1"></i>Home
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <i className="fas fa-list-alt me-1"></i>
                Resume List
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="col-md-3 d-flex justify-content-end mt-0">
        <div className="d-flex justify-content-between align-items-center">
          
          <button
            className="btn btn-outline-success mt-3"
            data-bs-toggle="modal"
            data-bs-target="#uploadResumeModal"
          >
            Upload Resume
          </button>
        </div>
        </div>
        <div className="container" style={{ marginTop: "25px" }}>
        <ResumeGrid rowData={rowData} columns={columns} />
        </div>
        </div>
        <div
          className="modal fade"
          id="uploadResumeModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="uploadResumeModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="uploadResumeModalLabel">
                  Upload Files
                </h5>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="file"
                    id="formFileMultiple"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    multiple
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="jobDropdown" className="form-label">
                    Select Job:
                  </label>
                  <select
                    className="form-select"
                    id="jobDropdown"
                    value={selectedJobName}
                    onChange={handleJobChange}
                  >
                    <option value="">Select Job</option>
                    {jobslist && Array.isArray(jobslist)
                      ? jobslist.map((job) => (
                          <option key={job.id} value={job.name}>
                            {job.name}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={handleUpload}
                  data-bs-toggle="modal"
                  data-bs-target="#parseResumeModal"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
        className="modal fade"
        id="parseResumeModal"
        tabIndex="-1"
        aria-labelledby="parseResumeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="parseResumeModalLabel">
                Applied Job : {selectedJobName}
                <br></br>
                Resume Data:
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <ShowParseResumes
                  rowData={showParseResumesData}
                  onEdit={handleUpdateData}
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
                onClick={() => {
                  handleSaveChanges();
                  createCandidate();
                }}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="resumedeletemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="btn-outline-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this candidate?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleConfirmDelete}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="resumeeditmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Edit Resume</h5>
              <button
                type="button"
                className="btn-outline-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ResumeEditForm
                editedRow={editedRow}
                onFormSubmit={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridComponent;