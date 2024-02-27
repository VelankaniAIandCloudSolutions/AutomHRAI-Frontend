import React, { useState, useEffect } from "react";
import axios from "axios";

import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
function Users() {
  const [rowData, setRowData] = useState([]);

  const fetchAllUsers = async () => {
    await axios
      .get("/accounts/users/")
      .then((response) => {
        const modifiedData = response.data.users.map((user) => ({
          ...user,
          employeeName: `${user.first_name || ""} ${user.last_name || ""}`,
        }));
        setRowData(modifiedData);
        console.log("api data", response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    await axios
      .delete(`/accounts/users/delete/${userId}/`)
      .then((response) => {
        console.log("User deleted successfully:", response.data);
        fetchAllUsers();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-9 mt-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Users</h2>
            <span className="ms-3 fs-4 text-muted">|</span>
            <nav aria-label="breadcrumb" className="d-inline-block ms-3">
              <ol className="breadcrumb bg-transparent m-0 p-0">
                <li className="breadcrumb-item">
                  <a href="/">
                    <i className="fas fa-home"></i> Home
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="fas fa-users"> </i> Users
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="col-md-3 d-flex justify-content-end mt-4">
          <a
            className="btn btn-primary"
            href="/users/create-user/"
            role="button"
          >
            <i className="fas fa-user-plus"> </i> Create New User
          </a>
        </div>

        <div className="container" style={{ marginTop: "25px" }}>
          <AgGridUserList rowData={rowData} onDeleteUser={handleDeleteUser} />
        </div>
      </div>

      <div
        className="modal fade"
        id="deletemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Delete User
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to delete?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
