// import React from "react";
import axios from "axios";
import { async } from "q";
import React, { useState } from "react";
import { useEffect } from "react";
import CandidateList from "../../components/CandidateRanking/CandidateList";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch,useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
// import axios from 'axios'

const Candidates = () => {

  const dispatch=useDispatch();
  const loading=useSelector(state=>state.loading.loading)
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    dispatch(showLoading());
    try {
      const response = await axios.get('resume-parser/get_candidate_list/');
      console.log("The candidates data:", response.data);
      setCandidates(response.data); 
      dispatch(hideLoading());
    } catch (error) {
      console.error('Error fetching candidates:', error);
      dispatch(hideLoading());
    }
  };


  useEffect(() => {
    fetchCandidates();
    }, []);


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
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
      <div className="row align-items-center">
      <div className="col-md-9 mt-4">
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

      <div className="container" style={{ marginTop: "25px" }}>
        <CandidateList  candidates={candidates}/>
      </div>
    </div>
    </>
      )}
    </div>
  );
};

export default Candidates;
