import React from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import Candidates from "./pages/CandidateRanking/Candidates";
import Jobgroups from "./pages/CandidateRanking/JobGroups";
import Jobs from "./pages/CandidateRanking/Jobs";
import ResumeDetails from "./pages/ResumeParsing/ResumeDetails";
import attendanceList from "./pages/FaceRecognition/attendanceList";
import Users from "./pages/Accounts/Users";
import CreateUser from "./pages/Accounts/CreateUser";
import EditUser from "./pages/Accounts/EditUser";
import CheckInCheckOut from "./pages/FaceRecognition/CheckInCheckOut";
import RankCandidates from "./pages/CandidateRanking/RankCandidates";
import MyComponent from "./pages/FaceRecognition/checkintest";

export default function App() {
  return (
    <Router>
      <div className="wrapper">
        <AppHeader />
        <AppSidebar />
        <div className="content-wrapper">
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/resume-details" component={ResumeDetails} />
            <Route path="/candidate-list" exact component={Candidates} />
            <Route path="/job-groups" exact component={Jobgroups} />
            <Route path="/jobs" exact component={Jobs} />
            <Route path="/attendance" component={attendanceList} />
            <Route path="/users/create-user" component={CreateUser} />
            <Route path="/users/edit-user" component={EditUser} />
            <Route path="/users" component={Users} />
            <Route path="/checkin" component={CheckInCheckOut} />
            <Route path="/rank-candidates" component={RankCandidates} />
            <Route path="/test-component" component={MyComponent} />

          </Switch>
        </div>
      </div>
      <ToastContainer  position="bottom-right" autoClose={3000} />
    </Router>
  );
}
