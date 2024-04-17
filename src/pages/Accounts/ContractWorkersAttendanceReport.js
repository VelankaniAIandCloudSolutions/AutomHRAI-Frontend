import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import AgGridContractWorkersAttendanceReport from "../../components/FaceRecognition/AgGridContractWorkersAttendanceReport";
import AgGridContractWorkerList from "../../components/FaceRecognition/AgGridContractWorkerList";
import AgGridProjectList from "../../components/FaceRecognition/AgGridProjectList";

function ContractWorkersAttendanceReport() {
  const [rowData, setRowData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    // Call your API here with the new date
    if (newDate) {
      console.log("Calling API with date:", newDate);
      fetchReportData(newDate);
    }
  };

  const fetchReportData = async (date) => {
    dispatch(showLoading());
    await axios
      .get("/facial-recognition/contract-workers/attendance-report/", {
        params: { date: date },
      })
      .then((response) => {
        console.log("api data", response.data);
        setRowData(response.data.projects);
        dispatch(hideLoading());
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(hideLoading());
        // Handle error if needed
      });
  };
  // useEffect(() => {
  //   // Initially fetch data with empty date
  //   fetchReportData("");

  //   // Cleanup function
  //   return () => {
  //     // Any cleanup code goes here
  //   };
  // }, []);

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Contract Workers Attendance Report</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-file"> </i> Report
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-4">
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>

            <div className="container" style={{ marginTop: "25px" }}>
              <AgGridContractWorkersAttendanceReport rowData={rowData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ContractWorkersAttendanceReport;
