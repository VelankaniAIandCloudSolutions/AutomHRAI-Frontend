import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ResumeGrid = ({ columns, rowData }) => {
  return (
    <div className="ag-theme-quartz" style={{ width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        domLayout="autoHeight"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        defaultColDef={{ sortable: true, resizable: true }}
      />
    </div>
  );
};

export default ResumeGrid;
