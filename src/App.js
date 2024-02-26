import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import Candidates from "./pages/CandidateRanking/Candidates";
import Jobgroups from "./pages/CandidateRanking/JobGroups";
import Jobs from "./pages/CandidateRanking/Jobs";
import ResumeDetails from "./pages/ResumeParsing/ResumeDetails";
import attendanceList from "./pages/FaceRecognition/attendanceList";
import EmployeeAttendance from "./pages/FaceRecognition/EmployeeAttendance";
import Users from "./pages/Accounts/Users";
import CreateUser from "./pages/Accounts/CreateUser";
import EditUser from "./pages/Accounts/EditUser";
import CheckInCheckOut from "./pages/FaceRecognition/CheckInCheckOut";
import RankCandidates from "./pages/CandidateRanking/RankCandidates";

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
            <Route path="/employee-attendance" exact component={EmployeeAttendance}/>
            <Route path="/users/create-user" component={CreateUser} />
            <Route path="/users/edit-user/:id" component={EditUser} />
            <Route path="/users" component={Users} />
            <Route path="/checkin" component={CheckInCheckOut} />
            <Route path="/rank-candidates" component={RankCandidates} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}
