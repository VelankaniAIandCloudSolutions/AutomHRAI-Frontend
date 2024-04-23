import React, { useState, useEffect } from "react";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import AgencyAgGrid from "../../components/Account/AgencyAgGrid";
import AgencyForm from "../../components/Account/AgencyForm";
import EditAgencyForm from "../../components/Account/EditAgencyForm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { hideLoading, showLoading } from "../../actions/loadingActions";
import { toast } from "react-toastify";

const Agency = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [formData, setFormData] = useState("");
  const [editFormData, setEditFormData] = useState("");

  const [agencyData, setAgencyData] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);

  const handleSelectedAgency = (agency) => {
    setSelectedAgency(agency);
    console.log("Selected Agency:", agency);
  };
  const handleEditAgency = (agency) => {
    setSelectedAgency(agency);
    setEditFormData({
      name: agency.name,
      ownerName: agency.agency_owner,
      gst: agency.gst,
      labourLicense: agency.labour_license,
      pan: agency.pan,
      wcp: agency.wcp,
    });
    console.log("Selected Agency Edit:", agency);
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
    console.log("create");

    console.log("new form data", newFormData);
    console.log("new form data state ", formData);
  };
  const handleFormDataChangeEdit = (newFormData) => {
    setEditFormData(newFormData);
    console.log("edit");
    console.log("new form data", newFormData);
    console.log("new form data state ", editFormData);
  };

  const handleSubmit = async () => {
    dispatch(showLoading());
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await axios.post(
        "/accounts/agency_list/",
        formDataToSend
      );
      console.log(response.data);
      dispatch(hideLoading());
      toast.success("Agency deleted successfully");

      window.location.reload();
    } catch (error) {
      console.error("Error creating agency:", error);
      toast.error("Error Creating Agency");
      dispatch(hideLoading());
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      console.log(formData);
      for (const key in formData) {
        formDataToSend.append(key, editFormData[key]);
      }
      const response = await axios.put(
        `/accounts/edit_agency/${selectedAgency.id}/`,
        formDataToSend
      );
      console.log(response.data);
      dispatch(hideLoading());
      toast.success("Agency Edited successfully");

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error Editing Agency");
      dispatch(hideLoading());
    }
  };

  const getAgencyList = async () => {
    try {
      dispatch(showLoading());
      const getResponse = await axios.get("/accounts/agency_list/");
      setAgencyData(getResponse.data);
      console.log(getResponse.data);
      dispatch(hideLoading());
    } catch (error) {
      console.error("Error getting agency: ", error);
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getAgencyList();
  }, []);

  const confirmDelete = () => {
    dispatch(showLoading());
    axios
      .delete(`accounts/delete_agency/${selectedAgency.id}/`)
      .then((response) => {
        toast.success("Agency deleted successfully");
        window.location.reload();
        dispatch(hideLoading()); // Reload the page after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting candidate:", error);
        toast.success("Error Deleting Agency");
        dispatch(hideLoading());
      });
  };

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Agencies</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home me-1"></i>Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-list-alt me-1"></i>
                      Agencies
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div
              className="modal fade"
              id="deleteAgencyModal"
              tabindex="-1"
              aria-labelledby="deleteAgencyModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-5"
                      id="deleteAgencyModalLabel"
                    >
                      Delete Agency
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete the Agency?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="deleteAgencyModal"
              tabindex="-1"
              aria-labelledby="deleteAgencyModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1
                      className="modal-title fs-5"
                      id="deleteAgencyModalLabel"
                    >
                      Delete Agency
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete the Agency?
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="editAgencyModal"
              tabindex="-1"
              aria-labelledby="editAgencyModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="editAgencyModalLabel">
                      Edit Agency
                    </h1>

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <EditAgencyForm
                      onFormDataChange={handleFormDataChangeEdit}
                      isEdit={true}
                      selectedAgency={selectedAgency}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="agencyFormModal"
              tabIndex="-1"
              aria-labelledby="agencyFormModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="agencyFormModalLabel">
                      Add Agency
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <AgencyForm onFormDataChange={handleFormDataChange} />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-0">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-primary mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#agencyFormModal"
                >
                  <i className="fas fa-plus me-1"></i>
                  Add Agency
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <AgencyAgGrid
              agencyData={agencyData}
              onSelectAgency={handleSelectedAgency}
              onEditAgency={handleEditAgency}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Agency;
