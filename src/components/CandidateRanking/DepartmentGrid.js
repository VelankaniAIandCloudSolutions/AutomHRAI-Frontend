import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/dist/css/bootstrap.min.css';

const DepartmentGrid = ({ onRowSelected, departments }) => {
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const gridApiRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    const gridOptions = {
        rowSelection: 'multiple',
        columnDefs: [
            { checkboxSelection: true, headerCheckboxSelection: true, width: 50 },
            { headerName: 'Department Name', field: 'name' },
            { headerName: 'Company', field: 'company' }
        ],
        onSelectionChanged: () => {
            const selectedNodes = gridApiRef.current.getSelectedNodes();
            const selectedData = selectedNodes.map((node) => node.data);
            setSelectedRows(selectedData);
            onRowSelected(selectedData);
        },
    };

    const onGridReady = (params) => {
        gridApiRef.current = params.api;
    };

    const onSearchTermChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        applySearchFilter(term);
    };

    const applySearchFilter = (term) => {
        gridApiRef.current.setQuickFilter(term);
    };

    useEffect(() => {
        setRowData(departments);
    }, [departments]);

    const showSelectedDepartment = () => {
        console.log('Selected Department Data:', selectedRows);
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
                <AgGridReact
                    columnDefs={gridOptions.columnDefs}
                    gridOptions={gridOptions}
                    rowData={rowData}
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
};

export default DepartmentGrid;
