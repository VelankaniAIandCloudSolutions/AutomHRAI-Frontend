import React, { useState, useEffect } from "react";
import axios from "axios";

import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
function Users() {
  const [rowData, setRowData] = useState([]);
  // const [showDeleteModal, setshowDeleteModal] = useState(false);
  
  
  const fetchAllUsers=()=>{
    axios.get('/accounts/users/')
    .then((response) => {

      
      const modifiedData=response.data.users.map(user=>({
        ...user,
         employeeName: `${user.first_name || ''} ${user.last_name || ''}`

      }))
      setRowData(modifiedData)
      console.log("api data",response.data)
    })  
    .catch((error) => console.error("Error fetching data:", error));
  }

  useEffect(() => {
   
    fetchAllUsers();
  }, []); 

  const handleDeleteUser=(userId)=>{
    axios.delete(`/accounts/users/delete/${userId}/`).then((response)=>{
console.log('User deleted successfully:',response.data)
fetchAllUsers();
    })
    .catch(error=>{
      console.error('Error deleting user:',error)
    })
  }

  
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
          <a class="btn btn-primary" href="/users/create-user/" role="button">
            <i className="fas fa-user-plus"> </i> Create New User
          </a>
        </div>

        <div className="container" style={{ marginTop: "25px" }}>
          {/* The AG Grid component */}
          <AgGridUserList rowData={rowData} onDeleteUser={handleDeleteUser} />
        </div>
      </div>

      <div
        class="modal fade"
        id="deletemodal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Delete User
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Are you sure you want to delete?</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
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
