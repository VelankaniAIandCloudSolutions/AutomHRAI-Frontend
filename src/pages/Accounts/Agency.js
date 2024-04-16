import React, { useState , useEffect } from 'react';
import LoadingScreen from "../../components/Layout/LoadingScreen";
import AgencyAgGrid from '../../components/Account/AgencyAgGrid';
import AgencyForm from '../../components/Account/AgencyForm';
import axios from 'axios';

const Agency = ({ loading, }) => {

  const [formData, setFormData] = useState({
    name: '',
    agency_owner: '',
    GST: '',
    labour_license: null,
    PAN: '',
    wcp: null
  });
  const [agencyData, setAgencyData] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const handleDeleteClick = (agency) => {
    setSelectedAgency(agency);
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const response = await axios.post('/accounts/agency_list/', formDataToSend);
      console.log(response.data); 
      
    } catch (error) {
      console.error('Error creating agency:', error);
    }
  };

  const getAgencyList = async () => {
    try{
      const getResponse = await axios.get('/accounts/agency_list/');
      setAgencyData(getResponse.data);
      console.log(getResponse.data);
    }catch (error){
      console.error('Error getting agency: ', error);
    }
  };
  useEffect(() => {
    getAgencyList();
  }, []); 

  const confirmDelete = () => {
    axios
      .delete(`accounts/delete_agency/${selectedAgency}/`)
      .then((response) => {
        toast.success("Candidate deleted successfully");
        
      })
      .catch((error) => {
        console.error("Error deleting candidate:", error);
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
                <h2 className="mb-0">Agency</h2>
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

            <div className="modal fade" id="agencyFormModal" tabIndex="-1" aria-labelledby="agencyFormModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="agencyFormModalLabel">Add Agency</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <AgencyForm onFormDataChange={handleFormDataChange}  />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-outline-success" onClick={handleSubmit}>Save</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-0">
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className="btn btn-outline-success mt-3"
                  data-bs-toggle="modal"
                  data-bs-target="#agencyFormModal"
                >
                  Add Agency
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <AgencyAgGrid agencyData={agencyData} handleDeleteClick={handleDeleteClick} />
          </div>
        </>
      )}
    </div>
  );
};

export default Agency;
