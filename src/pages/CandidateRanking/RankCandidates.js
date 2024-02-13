import React, { useEffect, useState } from "react";
import AgGridJob from "../../components/CandidateRanking/AgGridJob";
import "../CandidateRanking/SelectJobs.css";
import Leaderboard from "../../components/CandidateRanking/Leaderboard";

function RankCandidates() {
  const [rowData, setRowData] = useState([
    {
      jobName: "Software Developer",
      jobGroup: "Software",
      department: "IT",
      jobDesc:
        "This book is a treatise on the theory of ethics, very popular during the Renaissance.",
      attachment: "attachments",
    },
    {
      jobName: "Business Executive",
      jobGroup: "MAnagement",
      department: "Management",
      jobDesc:
        "This book is a treatise on the theory of ethics, very popular during the Renaissance.",
      attachment: "attachments",
    },
  ]);

  const [rankData, setRankData] = useState([
    {
      name: "Test",
      points: "100",
      imageSrc:
        "https://img.freepik.com/free-vector/portrait-boy-with-brown-hair-brown-eyes_1308-146018.jpg?size=626&ext=jpg&ga=GA1.1.1448711260.1707177600&semt=ais",
      imagePrize:
        "https://raw.githubusercontent.com/malunaridev/Challenges-iCodeThis-01-to-10/master/4-leaderboard/assets/gold-medal.png",
    },
    {
      name: "Test2",
      points: "80",
      imageSrc: "https://cdn-icons-png.flaticon.com/512/5231/5231019.png",
    },
    {
      name: "Test3",
      points: "78",
      imageSrc:
        "https://i.pinimg.com/736x/73/b7/53/73b753791ea4234b6f7190d797cdc1c5.jpg",
    },
    {
      name: "Test4",
      points: "70",
      imageSrc:
        "https://t4.ftcdn.net/jpg/01/13/99/57/360_F_113995750_dAEGvjqxnsYD6asKjeDWJoVoSqjFvdGO.jpg",
    },
  ]);
  const [ShowLeaderboard, setShowLeaderboard] = useState(false);

  const handleRankCandidatesClick = () => {
    setShowLeaderboard(true);
  };

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
                <AgGridJob rowData={rowData} />
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
                onClick={handleRankCandidatesClick}
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
