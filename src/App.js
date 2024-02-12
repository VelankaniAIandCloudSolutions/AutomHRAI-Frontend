import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import Candidates from "./pages/Candidates/Candidates";
import Jobgroups from "./pages/Candidates/JobGroups";
import Jobs from "./pages/Candidates/Jobs";
import ResumeDetails from "./pages/UploadResume/ResumeDetails";
// import ShowResume from "./components/UploadResume/ShowParseResumes";

export default function App() {
  const baseUrl = "https://localhost:3000/";
  return (
    <div className="wrapper">
      <AppHeader />
      <AppSidebar />
      <div className="content-wrapper">
        <Router basename={baseUrl}>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/resume-details" component={ResumeDetails} />
            {/* <Route path="/show-resume" component={ShowResume} /> */}

            <Route path="/candidate-list" exact component={Candidates} />
            <Route path="/job-groups" exact component={Jobgroups} />
            <Route path="/jobs" exact component={Jobs} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}
