import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

import JobsForm from "./JobsForm";





const JobGroup = () => {

    const [rowData, setRowData] = useState([
        { id: 1, job_name: "Software Devloper" , job_group: "Information Technology", department: 'Ai and Cloud'},
        { id: 2,  job_name: "Accountant" , job_group: "Finance", department: 'Accounts'}
    ]);

    // const toggleCheckbox = (id) => {
    //     const updatedData = rowData.map(row => {
    //         if (row.id === id) {
    //             return { ...row, is_active: !row.is_active };
    //         }
    //         return row;
    //     });

    //     setRowData(updatedData);
    // };



    const [showModal, setShowModal] = useState(false);



    function ActionsCellRenderer(props) {
        return (
            <div>
                <button className="btn btn-primary btn-sm" onClick={() => props.onEditClick(props)}>Edit</button>
                <button className="btn btn-danger btn-sm mx-2" onClick={() => props.onDeleteClick(props)}>Delete</button>
            </div>
        );
    }

    const colDefs = [
        { headerName: 'Job Name', field: 'job_name' },
        { headerName: 'Job Group', field: 'job_group', filter: true },
        { headerName: 'Department', field: 'department' , filter: true},

        // {
        //     headerName: 'Is Active',
        //     field: 'is_active',
        //     cellRenderer: (params) => (
        //         <div style={{ marginLeft: '70px', marginTop: '8px' }}>
        //             <input
        //                 type="checkbox"
        //                 className="form-check-input"
        //                 checked={params.value}
        //                 onChange={() => toggleCheckbox(params.data.id)}
        //                 style={{ height: '23px', width: '23px', backgroundColor: params.value ? 'green' : 'transparent', cursor: 'pointer' }}
        //             />
        //             <label className="form-check-label" style={{ marginLeft: '20px' }}>
        //                 {params.value ? '' : ''}
        //             </label>
        //         </div>
        //     ),
        // },


        {
            headerName: 'Edit',
            cellRenderer: () => (
                <div style={{ marginLeft: '55px' }}>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#candidatemodal"

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
                <div class="modal-dialog  modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Update Job </h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <JobsForm />
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
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Job </h1>
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

export default JobGroup;

