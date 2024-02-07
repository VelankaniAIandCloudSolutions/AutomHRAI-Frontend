import React, { useState, useRef } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


import JobGroupsForm from "../../components/Candidate/JobGroupForm";
import JobGroup from "../../components/Candidate/JobGroup";
import DepartmentGrid from "../../components/Candidate/DepartmentGrid";

import 'bootstrap/dist/css/bootstrap.min.css';

const Jobgroups = () => {

    const [rowData, setRowData] = useState([
        { department_name: "AI and Cloud Solutions", company: "Velankani" },
        { department_name: "Electronics", company: "Infosys" },

    ]);

    const [selectedRows, setSelectedRows] = useState([]);

    const handleRowSelected = (selectedData) => {
        setSelectedRows(selectedData);
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
                <JobGroup />
            </div>

            <div class="modal fade" id="jobgroupmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel">Create Job Group</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <JobGroupsForm selectedRows={selectedRows} />


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Department Modal */}

            <div class="modal fade" id="departmentmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Select Department</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <DepartmentGrid onRowSelected={handleRowSelected} />

                           
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" data-bs-target="#jobgroupmodal" data-bs-toggle="modal">Back</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <button class="btn btn-primary" data-bs-target="#jobgroupmodal" data-bs-toggle="modal">Open first modal</button> */}


        </div>
    );
};

export default Jobgroups;



