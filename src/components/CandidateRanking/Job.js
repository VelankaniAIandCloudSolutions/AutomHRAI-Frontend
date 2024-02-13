import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import JobsForm from "./JobsForm";
import JobGroupGrid from "./JobGroupGrid";

const Job = () => {
    const [rowData, setRowData] = useState([
        { id: 1, job_name: "Software Developer", job_group: "Developers", department: 'AI and Cloud', description: "This is a static description for Software Developer." },
        { id: 2, job_name: "Accountant", job_group: "Accounts", department: 'Finance', description: "This is a static description for Accountant." }
    ]);

    const [selectedRows, setSelectedRows] = useState([]);

    console.log("the selected rows", selectedRows)
    
    const [showModal, setShowModal] = useState(false);
    const [selectedJobDescription, setSelectedJobDescription] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
   

    


    // const handleUpdateJobDepartment = () => {
    //     setUpdateJobDepartmentModal(true);
    // };

    const handleRowSelected = (selectedData) => {
        setSelectedRows(selectedData);
        if (selectedData.length > 0) {
            setSelectedRows(selectedData[0].job_group);
        } else {
            setSelectedRows(null);
        }
    };


    const handleEyeButtonClick = (row) => {
        setSelectedJobDescription(row.description);
    };

    const handleEditClick = (rowData) => {
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
            <button className="btn btn-primary btn-sm" onClick={() => props.onEditClick(props)}>Edit</button>
            <button className="btn btn-danger btn-sm mx-2" onClick={() => props.onDeleteClick(props)}>Delete</button>
        </div>
    );

    const colDefs = [
        { headerName: 'Job Name', field: 'job_name' },
        { headerName: 'Job Group', field: 'job_group', filter: true },
        { headerName: 'Department', field: 'department', filter: true },
        {
            headerName: 'Job Description',
            field: 'description',
            cellRenderer: (params) => (
                <div style={{ marginLeft: '55px' }}>
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
            headerName: 'Edit',
            cellRenderer: (params) => (
                <div style={{ marginLeft: '55px' }}>
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
                        <AgGridReact rowData={rowData} columnDefs={colDefs} frameworkComponents={frameworkComponents} onSelectionChanged={handleGridSelection} />
                    </div>
                </div>
            </div>

            <div className="modal fade" id="jobeditmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalToggleLabel">Update Job</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <JobsForm rowData={selectedRowData} selectedRows={selectedRows} mode={selectedRowData ? 'update' : 'create'}  />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="updatejobdepartmentmodal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Select Job Group and Department</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <JobGroupGrid onRowSelected={handleRowSelected} selectedRows={selectedRows} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#jobeditmodal">Back</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deletemodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Delete Job </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="descriptionmodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Job Description </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedJobDescription}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Job;
