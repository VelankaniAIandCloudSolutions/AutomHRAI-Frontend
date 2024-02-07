
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ResumeGrid = ({ columns, rowData }) => {
  return (
    <div className='ag-theme-alpine mt-2' style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        domLayout='autoHeight'
        defaultColDef={{ sortable: true, resizable: true }}
      />
    </div>
  );
};

export default ResumeGrid;

