import React from 'react'

function CheckInCheckOut() {
  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <div className="col-3">
              <h1>Attendance List</h1>
            </div>          
            <div className="col-0">
              <span className="mx-0">|</span>
            </div>
            <div className="col-9">
              <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-list"> </i> Attendance List</li>
                </ol>
              </nav>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckInCheckOut
