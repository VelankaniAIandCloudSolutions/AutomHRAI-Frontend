import React, { useState, useEffect } from 'react';

const EditForm = ({ editedRow, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    education: '',
    skills: '',
    college_name: '',
    company_name: '',
    experience: '',
    total_experience: '',
    resume_file_path: null,
  });

  
  useEffect(() => {
    setFormData(editedRow);
  }, [editedRow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      console.log("the", updatedData); 
      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('the file:',file);
    setFormData((prevData) => ({
      ...prevData,
      resume_file_path: file,
    }));
  };
  const handleChanges = () => {
    onFormSubmit(formData)
    window.location.reload();
};
  

  return (
    <div className="container mt-5">
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">
            Mobile Number:
          </label>
          <input
            type="text"
            className="form-control"
            id="mobileNumber"
            name="mobile_number"
            value={formData.mobile_number|| ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="education" className="form-label">
            Education:
          </label>
          <input
            type="text"
            className="form-control"
            id="education"
            name="education"
            value={formData.education || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="skills" className="form-label">
            Skills:
          </label>
          <input
            type="text"
            className="form-control"
            id="skills"
            name="skills"
            value={formData.skills || ''}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="collegeName" className="form-label">
            College Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="collegeName"
            name="college_name"
            value={formData.college_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">
            Company Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="companyName"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="experience" className="form-label">
            Experience:
          </label>
          <input
            type="text"
            className="form-control"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="totalExperience" className="form-label">
            Total Experience:
          </label>
          <input
            type="text"
            className="form-control"
            id="totalExperience"
            name="total_experience"
            value={formData.total_experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="resumeFile" className="form-label">
            Resume File:
          </label>
          <input
            type="file"
            className="form-control"
            id="resumeFile"
            name="resume_file_path"

            onChange={handleFileChange}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleChanges}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditForm;
