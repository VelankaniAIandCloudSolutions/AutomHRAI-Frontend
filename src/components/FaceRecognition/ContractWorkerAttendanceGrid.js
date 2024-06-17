import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function ContractWorkerAttendanceGrid({
  attendanceData,
  onSelectionChange,
  showImgInNewWindow = false,
}) {
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [colDefs, setColDefs] = useState([
    {
      headerName: "Name",
      field: "user.full_name",
      filter: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    { headerName: "Agency", field: "user.agency.name", filter: true },
    { headerName: "Attendance Type", field: "type", filter: true },
    { headerName: "Date Time", field: "created_at", filter: true },
    {
      headerName: "Location",
      field: "location.name",
      filter: true,
    },
    // {
    //   headerName: "Image",
    //   cellRenderer: (params) => (
    //     <button
    //       type="button"
    //       className="btn btn-primary btn-sm"
    //       data-bs-toggle="modal"
    //       data-bs-target="#imageModal"
    //       onClick={() => handleViewImage(params.data)}
    //     >
    //       <i className="fas fa-eye"></i>
    //     </button>
    //   ),
    // },
    {
      headerName: "Image",
      field: "image",
      cellRenderer: (params) => {
        const handleClick = () => {
          if (showImgInNewWindow) {
            window.open(params?.data?.user?.user_image, "_blank");
          } else {
            handleViewImage(params.data);
          }
        };

        return (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            data-bs-toggle={showImgInNewWindow ? "" : "modal"}
            data-bs-target={showImgInNewWindow ? "" : "#imageModal"}
            onClick={handleClick}
          >
            <i className="fas fa-eye"></i>
          </button>
        );
      },
    },
    {
      headerName: "Project",
      field: "project.name",
      filter: true,
    },
  ]);

  useEffect(() => {
    onSelectionChange(selectedRows);
  }, [selectedRows]);

  const handleViewImage = (data) => {
    setSelectedImage(data);
  };

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const gridOptions = {
    onGridReady: (params) => {
      setGridApi(params.api);
    },
  };
  return (
    <div>
      <div className="ag-theme-quartz" style={{ height: 550 }}>
        <AgGridReact
          rowData={attendanceData}
          columnDefs={colDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          rowSelection={"multiple"}
          rowMultiSelectWithClick={true}
          gridOptions={gridOptions}
          onSelectionChanged={onSelectionChanged}
        />
      </div>
      <div
        className="modal fade"
        id="imageModal"
        tabIndex="-1"
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="imageModalLabel">
                Attendance Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedImage.image ? (
                <img
                  src={selectedImage.image}
                  id="modalImage"
                  className="img-fluid"
                  alt="Attendance"
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
