import React, { useState, useEffect } from "react";

const AddAgencyForm = ({ onFormDataChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    gst: "",
    labourLicense: null,
    pan: "",
    wcp: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: files ? files[0] : value,
    }));
  };

  useEffect(() => {
    console.log(formData);
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Enter name"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="ownerName" className="form-label">
          Owner Name
        </label>
        <input
          type="text"
          className="form-control"
          id="ownerName"
          name="ownerName"
          placeholder="Enter owner name"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="gst" className="form-label">
          GST
        </label>
        <input
          type="text"
          className="form-control"
          id="gst"
          name="gst"
          placeholder="Enter GST"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="labourLicense" className="form-label">
          Labour License
        </label>
        <input
          type="file"
          className="form-control"
          id="labourLicense"
          name="labourLicense"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="pan" className="form-label">
          PAN
        </label>
        <input
          type="file"
          className="form-control"
          id="pan"
          name="pan"
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="wcp" className="form-label">
          W.C.P (Worker Compensation Policy)
        </label>
        <input
          type="file"
          className="form-control"
          id="wcp"
          name="wcp"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AddAgencyForm;
