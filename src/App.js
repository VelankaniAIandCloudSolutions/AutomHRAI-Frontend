import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import Candidates from "./pages/Candidates/Candidates";
import Jobgroups from "./pages/Candidates/JobGroups";
import Jobs from "./pages/Candidates/Jobs";
import ResumeDetails from "./pages/UploadResume/ResumeDetails";
import attendanceList from "./pages/attendanceList";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import CheckInCheckOut from "./pages/CheckInCheckOut";
import RankCandidates from "./pages/Candidates/RankCandidates";

export default function App() {
  return (
    <div className="wrapper">
      <AppHeader />
      <AppSidebar />
      <div className="content-wrapper">
        <Router>
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
          </Switch>
        </Router>
      </div>
    </div>
  );
}
