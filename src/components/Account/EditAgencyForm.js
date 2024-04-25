import React, { useState, useEffect } from "react";

const AgencyFormEdit = ({ onFormDataChange, isEdit, selectedAgency }) => {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    gst: "",
    labourLicense: null,
    pan: "",
    wcp: null,
    clearLabourLicense: false,
    clearPan: false,
    clearWcp: false,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    const clearCheckboxName = `clear${
      name.charAt(0).toUpperCase() + name.slice(1)
    }`;
    const isClearChecked = formData[clearCheckboxName];

    const fileValue = isClearChecked
      ? formData[name]
      : files
      ? files[0]
      : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: fileValue,
    }));
  };

  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  useEffect(() => {
    if (selectedAgency) {
      setFormData({
        name: selectedAgency.name,
        ownerName: selectedAgency.agency_owner,
        gst: selectedAgency.gst,
        labourLicense: selectedAgency.labour_license,
        pan: selectedAgency.pan,
        wcp: selectedAgency.wcp,
        clearLabourLicense: false,
        clearPan: false,
        clearWcp: false,
      });
    }
  }, [isEdit, selectedAgency]);

  const extractFileName = (url) => {
    if (typeof url !== "string") {
      return "";
    }

    const parts = url.split("/");
    return parts[parts.length - 1];
  };

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
          value={formData.name}
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
          value={formData.ownerName}
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
          value={formData.gst}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="labourLicense" className="form-label">
          Labour License
        </label>
        {formData.labourLicense && !formData.clearLabourLicense && (
          <div className="d-flex align-items-center mb-2">
            <a
              href={formData.labourLicense}
              target="_blank"
              rel="noopener noreferrer"
            >
              {extractFileName(formData.labourLicense)}
            </a>
          </div>
        )}

        <div className="d-flex align-items-center mb-2">
          <input
            type="checkbox"
            checked={formData.clearLabourLicense}
            onChange={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                clearLabourLicense: !prevFormData.clearLabourLicense,
              }))
            }
          />

          <label htmlFor="clearLabourLicense" className="form-check-label ms-2">
            Clear
          </label>
        </div>

        {!formData.clearLabourLicense && (
          <input
            type="file"
            className="form-control"
            id="labourLicense"
            name="labourLicense"
            onChange={handleChange}
          />
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="pan" className="form-label">
          PAN
        </label>
        {formData.pan && !formData.clearPan && (
          <div className="d-flex align-items-center mb-2">
            <a href={formData.pan} target="_blank" rel="noopener noreferrer">
              {extractFileName(formData.pan)}
            </a>
          </div>
        )}

        <div className="d-flex align-items-center mb-2">
          <input
            type="checkbox"
            checked={formData.clearPan}
            onChange={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                clearPan: !prevFormData.clearPan,
              }))
            }
          />
          <label htmlFor="clearPan" className="form-check-label ms-2">
            Clear
          </label>
        </div>

        {!formData.clearPan && (
          <input
            type="file"
            className="form-control"
            id="pan"
            name="pan"
            onChange={handleChange}
          />
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="wcp" className="form-label">
          W.C.P (Worker Compensation Policy)
        </label>
        {formData.wcp && !formData.clearWcp && (
          <div className="d-flex align-items-center mb-2">
            <a href={formData.wcp} target="_blank" rel="noopener noreferrer">
              {extractFileName(formData.wcp)}
            </a>
          </div>
        )}

        <div className="d-flex align-items-center mb-2">
          <input
            type="checkbox"
            checked={formData.clearWcp}
            onChange={() =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                clearWcp: !prevFormData.clearWcp,
              }))
            }
          />
          <label htmlFor="clearWcp" className="form-check-label ms-2">
            Clear
          </label>
        </div>

        {!formData.clearWcp && (
          <input
            type="file"
            className="form-control"
            id="wcp"
            name="wcp"
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default AgencyFormEdit;
