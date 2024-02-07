// import React from "react";
import React, { useState } from "react"
import CandidateList from "../../components/Candidate/CandidateList";

// import axios from 'axios'

const Candidates = () => {

  // const [candidates, setCandidates] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/v1/resume-parser/get_candidates_list'); 
  //     // setCandidates(response.data);
  //     console.log('Fetched data:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  
  // // Call the fetchData function inside the useEffect to ensure it runs after component mount
  // useEffect(() => {
  //   fetchData();
  // }, []);
  




  return (
    <div className="container" >
      <div className="col-md-6 mt-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Candidates List</h2>
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
                Candidates List
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container" style={{marginTop: '25px'}}>
       
        <CandidateList 
           
        />
      </div>
    </div>
  );
};

export default Candidates;
