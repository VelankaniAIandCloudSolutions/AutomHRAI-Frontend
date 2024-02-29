import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

import UpdateCandidate from "./UpdateCandidate";

const CandidateList = ({ candidates }) => {
  const [rowData, setRowData] = useState(candidates);

  useEffect(() => {
    setRowData(candidates);
  }, [candidates]);

  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleEditClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleDeleteClick = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const confirmDelete = () => {
    axios
      .delete(`resume-parser/delete_candidate/${selectedCandidate.id}/`)
      .then((response) => {
        toast.success("Candidate deleted successfully");
        setShowModal(false);
        // Update the candidate list by removing the deleted candidate
        setRowData(
          rowData.filter((candidate) => candidate.id !== selectedCandidate.id)
        );
      })
      .catch((error) => {
        console.error("Error deleting candidate:", error);
        // Handle error scenarios
      });
  };

  // function ActionsCellRenderer(props) {
  //   return (
  //     <div>
  //       <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(props.data)}>Edit</button>
  //       <button className="btn btn-danger btn-sm mx-2" onClick={() => props.onDeleteClick(props)}>Delete</button>
  //     </div>
  //   );
  // }

  const colDefs = [
    { headerName: "First Name", field: "first_name" },
    { headerName: "Last Name", field: "last_name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone_number" },

    {
      headerName: "Download Resume",
      field: "id",
      cellRenderer: (params) => {
        console.log("the params data", params.data);
        return (
          <div style={{ marginLeft: "55px" }}>
            <a
              href={params.data.resume.resume_file_path}
              target="_blank"
              className="btn btn-success btn-sm"
              download={`resume_${params.data.id}.pdf`}
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        );
      },
    },

    // {
    //   headerName: "Download Resume",
    //   field: "resume",
    //   cellRenderer: (params) => (
    //     <div style={{ marginLeft: "55px" }}>
    //       <a
    //         href={params.value}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="btn btn-success btn-sm"
    //       >
    //         <FontAwesomeIcon icon={faDownload} />
    //       </a>
    //     </div>
    //   ),
    // },

    {
      headerName: "Edit",
      field: "id",
      cellRenderer: (params) => (
        <div style={{ marginLeft: "55px", marginBottom: "56px" }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#candidatemodal"
            style={{ marginBottom: "35px" }}
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
            data-bs-toggle="modal"
            data-bs-target="#deletemodal"
            onClick={() => handleDeleteClick(params.data)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </a>
        </div>
      ),
    },
  ];

  // const frameworkComponents = {
  //   actionsCellRenderer: ActionsCellRenderer,
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  // };

  return (
    <div className="row align-items-center">
      <div className="content">
        <div className="container-fluid">
          <div className="ag-theme-quartz" style={{ height: 400 }}>
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="candidatemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Candidate
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <UpdateCandidate candidate={selectedCandidate} />
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <div
        className="modal fade"
        id="deletemodal"
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
                className="btn-close"
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
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
