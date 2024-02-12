import React from 'react'

function EditUser() {
  return (
    <div className="container">
    <div className="row align-items-center">
      <div className="col-md-9 mt-4">
        <div className="d-flex align-items-center">
          
        <h2 className="mb-0">Users</h2>
          
          
        <span className="ms-3 fs-4 text-muted">|</span>
          
          
            <nav aria-label="breadcrumb" className="mt-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                <li className="breadcrumb-item"><a href="/users"> <i className="fas fa-users"></i> Users</a></li>
                <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-pen"> </i> Update User</li>
              </ol>
            </nav>
         </div>
      </div>
      <div className='col-md-3 d-flex justify-content-end mt-4'>
            <a class="btn btn-primary" href="#" role="button"><i className="fas fa-pen"> </i> Update User</a>
      </div>
    </div>

        <div className="card-container mt-4">
          <div className="card">
          <h5 className="card-header">User Information</h5>
            <div className="card-body">
              
              <div className="form-container">
                <div>
                  <label htmlFor="inputName" className="form-label">Employee Name</label>
                  <input type="text" className="form-control" id="inputName" />
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type="text" className="form-control" id="inputEmail4" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputName4" className="form-label">Password</label>
                    <input type="text" className="form-control" id="inputPassword4" />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="inputUserID" className="form-label">Employee ID</label>
                    <input type="text" className="form-control" id="inputUserID" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="inputPhoneNumber" className="form-label">Mobile Number</label>
                    <input type="tel" className="form-control" id="inputPhoneNumber" />
                  </div>
                  <div className="row g-3">
                    <div className="col">
                      <label htmlFor="inputImage" className="form-label">Image Upload</label>
                      <input type="file" className="form-control" id="inputImage" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
   
  )
}

export default EditUser
