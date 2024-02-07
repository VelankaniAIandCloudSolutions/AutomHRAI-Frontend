import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import Candidates from "./pages/Candidates/Candidates";
import Jobgroups from "./pages/Candidates/JobGroups";
import Jobs from "./pages/Candidates/Jobs";

export default function App() {
  return (
    <div className="wrapper">
      <AppHeader />
      <AppSidebar />
      <div className="content-wrapper">
        <Router>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/candidate-list" exact component={Candidates} />
            <Route path="/job-groups" exact component={Jobgroups} />
            <Route path="/jobs" exact component={Jobs} />
            
          </Switch>
        </Router>
      </div>
    </div>
  );
}
