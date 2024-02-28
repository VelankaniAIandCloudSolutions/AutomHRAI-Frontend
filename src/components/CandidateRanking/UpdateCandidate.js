import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import axios from 'axios';

const UpdateCandidateModal = ({ candidate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    education: '',
    company_name: '',
    designation: '',
    total_experience: '',
    phone_number: '',
    skills: '',
    college_name: '',
    experiance: '',
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        first_name: candidate.first_name || '',
        last_name: candidate.last_name || '',
        email: candidate.email || '',
        education: candidate.resume.education || '',
        company_name: candidate.resume.company_name || '',
        designation: candidate.resume.designation || '',
        total_experience: candidate.resume.total_experience || '',
        phone_number: candidate.phone_number || '',
        skills: candidate.resume.skills || '',
        college_name: candidate.resume.college_name || '',
        experiance: candidate.resume.experience || '',
      });
    }
  }, [candidate]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    axios.put(`resume-parser/update_candidate/${candidate.id}/`, formData)
      .then(response => {
        console.log('Candidate updated successfully:', response.data);
        toast.success('Candidate updated successfully');
        
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3000 milliseconds = 3 seconds
      
        // Handle any success actions, such as closing the modal or updating state
      })
      .catch(error => {
        console.error('Error updating candidate:', error);
        // Handle error scenarios
      });
  };


  return (
    <form>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">First Name:</label>
            <input type="text" className="form-control" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="education" className="form-label">Education:</label>
            <input type="text" className="form-control" id="education" name="education" value={formData.education} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="company_name" className="form-label">Company Name:</label>
            <input type="text" className="form-control" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="designation" className="form-label">Designation:</label>
            <input type="text" className="form-control" id="designation" name="designation" value={formData.designation} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="total_experience" className="form-label">Total Experience:</label>
            <input type="text" className="form-control" id="total_experience" name="total_experience" value={formData.total_experience} onChange={handleChange} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">Last Name:</label>
            <input type="text" className="form-control" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone Number:</label>
            <input type="number" className="form-control" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Skills:</label>
            <input type="text" className="form-control" id="skills" name="skills" value={formData.skills} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="college_name" className="form-label">College Name:</label>
            <input type="text" className="form-control" id="college_name" name="college_name" value={formData.college_name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="experiance" className="form-label">Experience:</label>
            <input type="text" className="form-control" id="experiance" name="experiance" value={formData.experiance} onChange={handleChange} />
          </div>
        </div>
      </div>
      
      <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
        Save changes
      </button>
    </form>
  );
};


export default UpdateCandidateModal;
