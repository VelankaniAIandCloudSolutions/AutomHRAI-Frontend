import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function AgGridJob({ rowData, onRowSelected }) {
  const colDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'Job Name',
      field: 'name',
      filter: true,
    },
    { headerName: 'Job Name', field: 'name', filter: true },
    { headerName: 'Job Group', field: 'job_group', filter: true },
    { headerName: 'Department', field: 'department', filter: true },
    { headerName: 'Job Description', field: 'job_description', filter: true },
    { headerName: 'Attachments', field: 'attachment', filter: true },
  ];

  const gridOptions = {
    rowSelection: 'single',
  };

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      onRowSelected(selectedRows[0]);
    }
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 300 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        gridOptions={gridOptions}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  );
}

export default AgGridJob;
