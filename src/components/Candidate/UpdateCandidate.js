// UpdateCandidateModal.js
import React, { useState, useEffect } from 'react';

const UpdateCandidateModal = () => {


  return (
    <form>
  <div className="row">
    <div className="col-md-6">
      {/* First Name */}
      <div className="mb-3">
        <label htmlFor="first_name" className="form-label">First Name:</label>
        <input type="text" className="form-control" id="first_name" name="first_name" />
      </div>

      

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email:</label>
        <input type="email" className="form-control" id="email" name="email" />
      </div>

      <div className="mb-3">
        <label htmlFor="education" className="form-label">Education:</label>
        <input type="text" className="form-control" id="education" name="education" />
      </div>

      <div className="mb-3">
        <label htmlFor="company_name" className="form-label">Company Name:</label>
        <input type="text" className="form-control" id="company_name" name="company_name" />
      </div>

      <div className="mb-3">
        <label htmlFor="designation" className="form-label">Designation:</label>
        <input type="text" className="form-control" id="designation" name="designation" />
      </div>

      <div className="mb-3">
        <label htmlFor="total_experience" className="form-label">Total Experiance:</label>
        <input type="text" className="form-control" id="total_experience" name="total_experience" />
      </div>

      

      {/* <div className="mb-3">
        <label htmlFor="resume" className="form-label">Resume:</label>
        <input type="text" className="form-control" id="resume" name="resume" />
      </div> */}

  
      
    </div>

    <div className="col-md-6">

      {/* Last Name */}
      <div className="mb-3">
        <label htmlFor="last_name" className="form-label">Last Name:</label>
        <input type="text" className="form-control" id="last_name" name="last_name" />
      </div>

      <div className="mb-3">
        <label htmlFor="phone_number" className="form-label">Phone Number:</label>
        <input type="number" className="form-control" id="phone_number" name="phone_number" />
      </div>

      <div className="mb-3">
        <label htmlFor="skills" className="form-label">Skills:</label>
        <input type="text" className="form-control" id="skills" name="skills" />
      </div>

      <div className="mb-3">
        <label htmlFor="college_name" className="form-label">College Name:</label>
        <input type="text" className="form-control" id="college_name" name="college_name" />
      </div>

      <div className="mb-3">
        <label htmlFor="experiance" className="form-label">Experiance:</label>
        <input type="text" className="form-control" id="experiance" name="experiance" />
      </div>

    
      
    </div>
  </div>

  {/* Add your submit button here
  <div className="mb-3">
    <button type="submit" className="btn btn-primary">Update</button>
  </div> */}
</form>

  );
};

export default UpdateCandidateModal;

