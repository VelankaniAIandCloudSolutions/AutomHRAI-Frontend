import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const JobGroupGrid = ({ onRowSelected, selectedRows }) => {

    const [rowData, setRowData] = useState([
        { job_group: "Developers", department: "Ai and Cloud" },
        { job_group: "Accounts", department: "Finance" },
    ]);

    const gridApiRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log('selectedRows789:', selectedRows);
    }, [selectedRows]);

    const gridOptions = {
        rowSelection: 'multiple',
        columnDefs: [
            { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
            { headerName: 'Job Group', field: 'job_group' },
            { headerName: 'Department', field: 'department' }
        ],
        onSelectionChanged: () => {
            const selectedNodes = gridApiRef.current.getSelectedNodes();
            const selectedData = selectedNodes.map((node) => node.data);
            onRowSelected(selectedData); 
        },
    };

    const onGridReady = (params) => {
        console.log("Grid is ready!"); // Add this line to check if onGridReady is triggered
        gridApiRef.current = params.api;
    
        if (selectedRows && selectedRows.length > 0) {
            selectedRows.forEach((selectedRow) => {
                gridApiRef.current.forEachNode((node) => {
                    // Check if both job_group and department match
                    if (node.data.job_group === selectedRow.job_group && node.data.department === selectedRow.department) {
                        // Set the row as selected
                        node.setSelected(true);
                    }
                });
            });
        }
    };
    
    
    
    
    
    
    

    const onSearchTermChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        applySearchFilter(term);
    };

    const applySearchFilter = (term) => {
        gridApiRef.current.setQuickFilter(term);
    };

    return (
        <div className="container">
            <div className="mb-3 position-relative">
                <label htmlFor="search" className="form-label visually-hidden">Search:</label>
                <div className="input-group">
                    <input
                        type="search"
                        className="form-control"
                        id="search"
                        value={searchTerm}
                        onChange={onSearchTermChange}
                        placeholder="Search"
                        aria-label="Search"
                        style={{
                            borderRadius: '0.25rem',
                        }}
                    />
                    <button type="button" className="btn btn-primary" data-mdb-ripple-init>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div className="ag-theme-quartz" style={{ height: 300 }}>
            <AgGridReact columnDefs={gridOptions.columnDefs} gridOptions={gridOptions} rowData={rowData} onGridReady={onGridReady} />

            </div>
        </div>
    );
};

export default JobGroupGrid;
