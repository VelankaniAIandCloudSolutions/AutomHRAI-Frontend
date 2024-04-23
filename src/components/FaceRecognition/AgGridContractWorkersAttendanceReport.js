import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useHistory } from "react-router-dom";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";
function AgGridUserList({ rowData, onDeleteContractWorker }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleDeleteClick = (projectId) => {
    setSelectedProjectId(projectId);
  };
  const handleClose = () => {
    setSelectedProjectId(null);
  };

  const handleConfirmDelete = () => {
    onDeleteContractWorker(selectedProjectId, handleClose);
  };
  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  // function ActionsCellRenderer(props) {
  //   const history = useHistory();
  //   console.log(props.data.id);
  //   const handleEditClick = () => {
  //     const projectId = props.data.id;
  //     history.push(`/projects/edit-project/${projectId}`);
  //   };
  //   const handleDeleteClickInRenderer = () => {
  //     const projectId = props.data.id;
  //     handleDeleteClick(projectId);
  //   };

  //   return (
  //     <div className="p-0">
  //       {
  //         <button className="btn btn-primary btn-sm " onClick={handleEditClick}>
  //           <i className="fas fa-pen"></i> Edit
  //         </button>
  //       }
  //       <button
  //         className="btn btn-danger btn-sm mx-2"
  //         data-bs-toggle="modal"
  //         data-bs-target="#deletemodal"
  //         onClick={handleDeleteClickInRenderer}
  //       >
  //         <i className="fas fa-trash"></i> Delete
  //       </button>
  //     </div>
  //   );
  // }

  function ActionsCellRenderer(props) {
    const handleViewClick = () => {
      const rowData = props.data; // Get the row data
      // Pass the rowData to your modal component
      // For simplicity, let's assume you have a function to set modal data
      console.log(" this is the rowDAta being passed in the modal", rowData);
      setModalData(rowData.entries);
    };

    return (
      <div className="p-0">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleViewClick}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>
    );
  }

  const formatTimeFromSeconds = (seconds) => {
    if (seconds === null || isNaN(seconds)) {
      return "-";
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}hrs ${minutes}min`;
    }
  };
  // const formatTimeFromSeconds = (seconds) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;

  //   // Ensure leading zeros for single-digit values
  //   const formattedHours = hours.toString().padStart(2, "0");
  //   const formattedMinutes = minutes.toString().padStart(2, "0");
  //   const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  //   return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  // };

  const colDefs = [
    {
      headerName: "Employee Name",
      width: 270,
      field: "user.full_name",
      filter: true,
    },
    {
      headerName: "Worked Hours",
      field: "work_time",
      width: 270,
      filter: true,
      valueFormatter: ({ value }) => formatTimeFromSeconds(value),
    },
    {
      headerName: "Break Time",
      field: "break_time",
      filter: true,
      width: 270,
      valueFormatter: ({ value }) => formatTimeFromSeconds(value),
    },
    {
      field: "id",
      headerName: "See All Entries",
      width: 270,
      cellRenderer: ActionsCellRenderer,
    },
  ];

  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                All Entries
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ContractWorkerAttendanceGrid
                attendanceData={modalData}
                onSelectionChange={handleSelectionChange}
                showImgInNewWindow={true}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmDelete}
                data-bs-dismiss="modal"
              >
                Confirm
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgGridUserList;
