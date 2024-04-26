import React, { useState, useEffect } from "react";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import axios from "axios";
import ContractWorkerAgGrid from "../../components/FaceRecognition/ContractWorkersTimeSheetGrid";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ContractWorkersTimesheet = ({ loading }) => {
  const [contractWorkers, setContractWorkers] = useState([]);
  const [selectContractWorker, setSelectedContractWorker] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "/facial-recognition/get_contract_worker_timesheet/",
        {
          user_id: selectContractWorker.id,
          start_date: startDate,
          end_date: endDate,
        }
      );
      console.log("Response:", response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchContractWorkers = async () => {
      try {
        const response = await axios.get(
          "/facial-recognition/get_contract_worker_timesheet/"
        );
        if (response.status === 200) {
          const responseData = response.data.user_data; // Assuming response data is in the format { user_data: [...] }
          setContractWorkers(responseData);
          console.log(responseData);
        } else {
          console.error("Error:", response.data);
        }
      } catch (error) {
        console.error("Network Error:", error);
      }
    };
    fetchContractWorkers();
  }, []);

  const onSelectionChanged = (event) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const selectedWorkerId = selectedRows[0].id;
      const selectedWorker = contractWorkers.find(
        (worker) => worker.id === selectedWorkerId
      );
      setSelectedContractWorker(selectedWorker);
    } else {
      setSelectedContractWorker(null);
    }
  };

  const columnDefs = [
    {
      headerName: "Employee ID",
      field: "emp_id",
      checkboxSelection: true,
    },
    { headerName: "Full Name", field: "full_name" },
    { headerName: "Email", field: "email" },
    { headerName: "Phone Number", field: "phone_number" },
  ];

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-12 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Contract Worker Attendance Report</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home me-1"></i>Home
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/face-recognition-reports">
                        <i className="fas fa-list-alt me-1"></i>Report
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-list-alt me-1"></i>
                      Contract Worker Attendance Report
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row mt-3">
              <div className="col-md-3 mt-4">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#selectWorkerModal"
                  className="btn btn-secondary"
                >
                  Select Worker
                  {selectContractWorker && (
                    <span className="h6 mt-2 pl-1">
                      : {selectContractWorker.full_name}
                    </span>
                  )}
                </button>
              </div>

              <div className="col-md-9 mt-1 d-flex justify-content-end">
                <div className="row align-items-center">
                  <div className="col-md-4 ">
                    <label htmlFor="start_date">Start Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="end_date">End Date:</label>
                    <input
                      type="date"
                      className="form-control "
                      id="end_date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mt-4 ">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary w-100"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="selectWorkerModal"
              tabIndex="-1"
              aria-labelledby="selectWorkerModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-5"
                      id="selectWorkerModalLabel"
                    >
                      Contract Workers
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div
                      className="ag-theme-quartz"
                      style={{ height: "500px", width: "100%" }}
                    >
                      <AgGridReact
                        rowData={contractWorkers}
                        columnDefs={columnDefs}
                        onSelectionChanged={onSelectionChanged}
                        pagination={true}
                        paginationPageSize={10}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className=" mt-4">
              <ContractWorkerAgGrid responseData={responseData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContractWorkersTimesheet;
