import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ResumeGrid = ({ rowData, onEdit }) => {
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.addEventListener("cellValueChanged", handleCellValueChanged);
    // params.api.addEventListener('rowDataChanged', handleRowDataChanged);
  };
  const handleCellValueChanged = (event) => {
    const updatedRowData = event.api
      .getModel()
      .rowsToDisplay.map((rowNode) => rowNode.data);
    console.log("Row Data Changed:", updatedRowData);
    onEdit(updatedRowData);
  };

  const handleUpdateButtonClick = (data) => {
    const {
      id,
      name,
      email,
      mobile_number,
      education,
      skills,
      college_name,
      company_name,
      experience,
      total_experience,
    } = data;

    const updatedResumes = [
      {
        id,
        name,
        email,
        mobile_number,
        education,
        skills,
        college_name,
        company_name,
        experience,
        total_experience,
      },
    ];
    console.log("Updated Resumes:", updatedResumes);

    onEdit(updatedResumes);

    updateResumeData(id, {
      name,
      email,
      mobile_number,
      education,
      skills,
      college_name,
      company_name,
      experience,
      total_experience,
    });
  };

  const updateResumeData = async (resumeId, updatedData) => {
    try {
      const response = await axios.put(
        `resume-parser/update_resume/${resumeId}/`,
        {
          updated_data: updatedData,
        }
      );
      console.log("Resume updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating resume:", error);
    }
  };

  const UpdateButtonRenderer = ({ data }) => {
    return (
      <button
        className="btn btn-outline-success mb-1"
        onClick={() => handleUpdateButtonClick(data)}
      >
        Update
      </button>
    );
  };

  const gridOptions = {
    columnDefs: [
      { headerName: "Name", field: "name", editable: true },
      { headerName: "Email", field: "email", editable: true },
      { headerName: "Mobile No", field: "mobile_number", editable: true },
      { headerName: "Qualification", field: "education", editable: true },
      { headerName: "Skills", field: "skills", editable: true },
      { headerName: "College Name", field: "college_name", editable: true },
      { headerName: "Company Name", field: "company_name", editable: true },
      { headerName: "Experience", field: "experience", editable: true },
      {
        headerName: "Total Experience",
        field: "total_experience",
        editable: true,
      },
      {
        headerName: "Download Resume",
        field: "resume",
        cellRenderer: (params) => (
          <div style={{ marginLeft: "55px" }}>
            <a
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success btn-sm"
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        ),
      },
      {
        headerName: "Update",
        field: "id",
        cellRenderer: UpdateButtonRenderer,
        suppressMovable: true,
        width: 100,
      },
    ],
  };

  return (
    <div
      className="ag-theme-alpine container"
      // style={{ height: 400, width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={gridOptions.columnDefs}
        gridOptions={gridOptions}
        pagination={true}
        paginationPageSize={10}
        domLayout="autoHeight"
        defaultColDef={{ editable: true, sortable: true, resizable: true }}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default ResumeGrid;
