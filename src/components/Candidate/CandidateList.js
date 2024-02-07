import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import UpdateCandidate from "./UpdateCandidate";

const CandidateList = () => {
  const [rowData, setRowData] = useState([
    { first_name: "MD", last_name: 'Adil', email: "md.adil@velankanigroup.com", phone_number: "9742560329" },
    { first_name: "Sahana", last_name: 'MS', email: "test@velankanigroup.com", phone_number: "9742560329" }
  ]);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  function ActionsCellRenderer(props) {
    return (
      <div>
        <button className="btn btn-primary btn-sm" onClick={() => props.onEditClick(props)}>Edit</button>
        <button className="btn btn-danger btn-sm mx-2" onClick={() => props.onDeleteClick(props)}>Delete</button>
      </div>
    );
  }

  const colDefs = [
    { headerName: 'First Name', field: 'first_name' },
    { headerName: 'Last Name', field: 'last_name' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone Number', field: 'phone_number' },
    {
      headerName: 'Download Resume',
      field: 'resume',
      cellRenderer: (params) => (
        <div style={{ marginLeft: '55px' }}>
          <a href={params.value} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </div>
      ),
    },
    {
      headerName: 'Action',
      cellRenderer: () => (
        <div style={{ marginLeft: '55px' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#candidatemodal"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      ),
    },
    {
      headerName: 'Action',
      cellRenderer: (params) => (
        <div style={{ marginLeft: '55px' }}>
          <a href={params.value} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deletemodal">
            <FontAwesomeIcon icon={faTrash} />
          </a>
        </div>
      ),
    },
  ];

  const frameworkComponents = {
    actionsCellRenderer: ActionsCellRenderer,
  };

  return (
    <div className="row align-items-center">
      <div className="content">
        <div className="container-fluid">
          <div className="ag-theme-quartz" style={{ height: 400 }}>
            <AgGridReact rowData={rowData} columnDefs={colDefs} frameworkComponents={frameworkComponents} />
          </div>
        </div>
      </div>

      
      <div class="modal fade" id="candidatemodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div class="modal-dialog .modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Update Candidate</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <UpdateCandidate />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      <div class="modal fade" id="deletemodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Candidate</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default CandidateList;

  