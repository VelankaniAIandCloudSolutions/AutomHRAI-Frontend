import React from "react";
import { Link } from "react-router-dom";

export default function FaceRecognitionReports() {
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-9 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Reports</h2>
            <span className="ms-3 fs-4 text-muted">|</span>
            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="fas fa-home"></i> Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-list"> </i> Face Recognition Reports
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="mt-4">
          <ul className="list-group">
            <li className="list-group-item">
              <Link to="/contract-workers-timesheet">
                Contract Worker Attendance Report
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/bulk-attendance-report">
                Bulk Contract Worker Attendance Report
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
