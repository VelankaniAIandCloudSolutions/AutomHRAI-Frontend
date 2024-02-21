import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';


import JobGroupsForm from "./JobGroupForm";
import DepartmentGrid from "./DepartmentGrid";





const JobGroup = ({ handleUpdateJobGroup, departments,  jobgroups,  handleSelectedRows, handleDeleteJobGroup }) => {

    const [rowData, setRowData] = useState([
        { id: 1, job_group: "Information Technology", department: 'Ai and Cloud', is_active: true },
        { id: 2, job_group: "Finance", department: 'Ai and Cloud', is_active: true }
    ]);

    const toggleCheckbox = (id) => {
        const updatedData = rowData.map(row => {
            if (row.id === id) {
                return { ...row, is_active: !row.is_active };
            }
            return row;
        });

        setRowData(updatedData);
    };



    const [showModal, setShowModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelected = (selectedData) => {
        setSelectedRows(selectedData);
        handleSelectedRows(selectedData);
        handleUpdateJobGroup(selectedData);
    };

   



    function ActionsCellRenderer(props) {
        const handleEditClick = () => {
            handleUpdateJobGroup(props.data);
        };
        return (
            <div>
                <button className="btn btn-primary btn-sm" onClick={handleEditClick} >Edit</button>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => props.onDeleteClick(props)}>Delete</button>
            </div>
        );
    }

    const colDefs = [
        { headerName: 'Job Group', field: 'name' },
        { headerName: 'Department', field: 'department_name' },
        {
            headerName: 'Is Active',
            field: 'isActive',
            cellRenderer: (params) => (
                <div style={{ marginLeft: '70px', marginTop: '8px' }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={params.value}
                        onChange={() => toggleCheckbox(params.data.id)}
                        style={{ height: '23px', width: '23px', backgroundColor: params.value ? 'green' : 'transparent', cursor: 'pointer' }}
                    />
                    <label className="form-check-label" style={{ marginLeft: '20px' }}>
                        {params.value ? '' : ''}
                    </label>
                </div>
            ),
        },


        {
            headerName: 'Edit',
            cellRenderer: (params) => (
                <div style={{ marginLeft: '55px' }}>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#candidatemodal"
                        onClick={() => handleRowSelected([params.data])} 

                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
            ),
        },
        {
            headerName: 'Delete',
            cellRenderer: (params) => (
                <div style={{ marginLeft: '55px' }}>
                    <a href={params.value} target="_blank" rel="noopener noreferrer" className="btn btn-danger btn-sm" onClick={() => handleRowSelected([params.data])}  data-bs-toggle="modal" data-bs-target="#deletemodal"> <FontAwesomeIcon icon={faTrash} />
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
                        <AgGridReact rowData={jobgroups} columnDefs={colDefs} frameworkComponents={frameworkComponents}  handleUpdateJobGroup={handleUpdateJobGroup} />
                    </div>
                </div>
            </div>


            <div class="modal fade" id="candidatemodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div class="modal-dialog .modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Job Group</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <JobGroupsForm selectedRows={ selectedRows} departments={departments} modalName="updatejogroupmodal" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={() => handleUpdateJobGroup(selectedRows)}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="modal fade"
                id="updatejogroupmodal"
                aria-hidden="true"
                aria-labelledby="exampleModalToggleLabel2"
                tabindex="-1"
            >
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">
                        Select Department
                    </h1>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                    </div>
            <div class="modal-body">
              <DepartmentGrid onRowSelected={handleRowSelected} departments={departments}  />
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#candidatemodal"
                data-bs-toggle="modal"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

            {/* Delete modal */}
            <div class="modal fade" id="deletemodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Job Group</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={handleDeleteJobGroup} data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobGroup;

