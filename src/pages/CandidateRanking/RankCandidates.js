import React, { useEffect, useState } from "react";
import AgGridJob from "../../components/CandidateRanking/AgGridJob";
import "../CandidateRanking/SelectJobs.css";
import Leaderboard from "../../components/CandidateRanking/Leaderboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function RankCandidates() {
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [rankData, setRankData] = useState([]);

  const handleRowSelected = (rowData) => {
    setSelectedRow(rowData);
    console.log(rowData);
  };
  const [ShowLeaderboard, setShowLeaderboard] = useState(false);

  const notifyError = (message) => {
    toast.error(message, {
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const handleRankCandidates = async () => {
    if (!selectedRow) {
      notifyError("Error: Please select a job.");
      return;
    }

    const jobId = selectedRow.id;
    try {
      const response = await axios.post(
        `candidate-ranking/rank_candidates/${jobId}/`
      );
      console.log("Rank Candidates Response", response.data);
      const rankedResumesData = response.data.ranked_resumes;

      setRankData(rankedResumesData);
      setShowLeaderboard(true);
    } catch (error) {
      console.error("Error ranking candidates:", error);
      toast.error("Error occured. Please try again.");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get("candidate-ranking/get_jobs/");
      console.log("the jobs data", response.data);
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching Jobgroups:", error);
    }
  };

  const fetchCandidateList = async () => {
    try {
      const response = await axios.get("resume-parser/candidate_list/");
      console.log("the Candidate List", response.data);
    } catch (error) {
      console.error("Error fetching Candidates:", error);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-9 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Rank Candidates</h2>

            <span className="ms-3 fs-4 text-muted">|</span>

            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    {" "}
                    <i className="fas fa-home"></i> Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-users"> </i> Rank Candidate
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="card-container mt-4">
          <div className="card">
            <h5 className="card-header">Rank Candidates</h5>
            <div className="card-body">
              <div className="d-flex justify-content-center">
                <a
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#jobmodal"
                  role="button"
                >
                  <i className="fas fa-user-plus"></i> Select Jobs
                </a>
              </div>
              {ShowLeaderboard && <Leaderboard data={rankData} />}
            </div>
          </div>
        </div>

        <div className="ag-theme-quartz" style={{ height: 500 }}>
          {/* The AG Grid component */}
          {/* <AgGridUserList rowData={rowData} /> */}
        </div>
      </div>

      <div
        className="modal fade"
        id="jobmodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          style={{ maxWidth: "80%", width: "80%", maxHeight: "70vh" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Jobs
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="ag-theme-quartz" style={{ height: 500 }}>
                {/* The AG Grid component */}
                <AgGridJob
                  rowData={rowData}
                  onRowSelected={handleRowSelected}
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
                onClick={handleRankCandidates}
                data-bs-dismiss="modal"
              >
                Rank Candidates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankCandidates;
