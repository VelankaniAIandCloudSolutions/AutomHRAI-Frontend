import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import AgGridMonthlyContractWorkerAttendanceReport from "../../components/FaceRecognition/AgGridMonthlyContractWorkerAttendanceReport";
function MonthlyContractWorkerAttendanceReport() {
  const [rowData, setRowData] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [contractWorkers, setContractWorkers] = useState([]);
  const [filteredContractWorkers, setFilteredContractWorkers] = useState([]);
  const [result, setResult] = useState([]);
  const [formData, setFormData] = useState({
    agency: "",
    workers: [],
    month: "",
    year: String(new Date().getFullYear()),
  });
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);

  const handleAgencyChange = (e) => {
    const selectedAgency = e.target.value;
    setFormData({ ...formData, agency: selectedAgency });
  };

  useEffect(() => {
    if (formData.agency) {
      const filteredWorkers = contractWorkers.filter(
        (worker) => worker.agency.id == formData.agency
      );
      setFilteredContractWorkers(filteredWorkers);
    }
  }, [formData, contractWorkers]);

  const handleWorkerChange = (e) => {
    const selectedWorkers = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, workers: selectedWorkers });
  };
  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setFormData({ ...formData, month: selectedMonth });
  };

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setFormData({ ...formData, year: selectedYear });
  };
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear; i >= 2024; i--) {
    yearOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  useEffect(() => {
    // Fetch agencies and contract workers data
    fetchAgenciesAndContractWorkers();
  }, []);

  const fetchAgenciesAndContractWorkers = async () => {
    try {
      const response = await axios.get(
        "/facial-recognition/get-agencies-and-contract-workers/"
      );
      console.log(
        " pre-populate agencies and contract workers data= ",
        response.data
      );
      setAgencies(response.data.agencies);
      setContractWorkers(response.data.contract_workers);
      setFilteredContractWorkers(response.data.contract_workers);
    } catch (error) {
      console.error("Error fetching agencies and contract workers:", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!formData.month) {
      toast.error("Please select a month!");
      return;
    }
    try {
      // Make the API call
      dispatch(showLoading());
      console.log("formData", formData);
      const response = await axios.post(
        "/facial-recognition/calculate-monthly-contract-worker-timesheet-report/",
        formData
      );

      // Log the response data to the console
      console.log(response.data);
      dispatch(hideLoading());

      // If you need to store the response data for further processing, you can set it to a state variable
      setRowData(response.data);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      dispatch(hideLoading());
      toast.error("Error generating report");
    }
  };
  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="d-flex align-items-center mt-4">
              <h2 className="mb-0">
                Contract Workers Monthly Attendance Report
              </h2>
              <span className="ms-3 fs-4 text-muted">|</span>
              <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                <ol className="breadcrumb bg-transparent m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/checkin-checkout">
                      <i className="fas fa-home"></i> Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <i className="fas fa-file"> </i> Report
                  </li>
                </ol>
              </nav>
            </div>
            {/*  select filters card start */}

            <div class="card mt-4 card-outline card-primary">
              <div class="card-header">
                <h3 class="card-title">
                  <strong>Select Filters:</strong>
                </h3>
                <div class="card-tools">
                  <button
                    class="btn-sm btn-primary"
                    onClick={handleGenerateReport}
                  >
                    Generate Report
                  </button>
                </div>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="selectAgencies">Select Agencies:</label>
                      <select
                        class="form-control custom-select"
                        id="selectAgencies"
                        onChange={handleAgencyChange}
                        value={formData.agency}
                      >
                        {" "}
                        <option value="">Select Agency</option>
                        {agencies.map((agency) => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="selectWorkers">Select Workers:</label>
                      <select
                        class="form-control custom-select"
                        id="selectWorkers"
                        onChange={handleWorkerChange}
                        value={formData.workers || []} // Initialize with empty array for multiple selection
                        multiple
                      >
                        <option value="All_Workers">All Workers</option>
                        {filteredContractWorkers.map((worker) => (
                          <option key={worker.id} value={worker.id}>
                            {worker.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="selectMonth">Select Month:</label>
                      <select
                        class="form-control custom-select"
                        id="selectMonth"
                        onChange={handleMonthChange}
                        value={formData.month}
                      >
                        <option value="">Select Month</option>
                        <option value="Jan">January</option>
                        <option value="Feb">February</option>
                        <option value="Mar">March</option>
                        <option value="Apr">April</option>
                        <option value="May">May</option>
                        <option value="Jun">June</option>
                        <option value="Jul">July</option>
                        <option value="Aug">August</option>
                        <option value="Sep">September</option>
                        <option value="Oct">October</option>
                        <option value="Nov">November</option>
                        <option value="Dec">December</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-3">
                    <div class="form-group">
                      <label for="selectYear">Select Year:</label>
                      <select
                        class="form-control custom-select"
                        id="selectYear"
                        onChange={handleYearChange}
                        value={formData.year} // Initialize with current year
                      >
                        {yearOptions}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*  filter card end */}

            {/* legend card  start */}

            <div class="card card-outline card-warning mt-4">
              <div class="card-header">
                <h3 class="card-title">
                  <strong>Legends:</strong>
                </h3>
                {/* <div class="card-tools">
                  <span class="badge badge-primary">Label</span>
                </div> */}
              </div>

              <div class="card-body" style={{ display: "flex" }}>
                {/* Legends */}
                <div>
                  <span class="badge badge-danger me-2">A</span>- Absent
                </div>
                <div style={{ marginLeft: "50px" }}>
                  <span class="badge bg-success me-2">P</span>- Present
                </div>
              </div>
            </div>

            {/* legend card end */}

            <div className="container mt-4">
              {rowData.length > 0 && (
                <AgGridMonthlyContractWorkerAttendanceReport
                  rowData={rowData}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MonthlyContractWorkerAttendanceReport;
