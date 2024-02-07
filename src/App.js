import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
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

          </Switch>
        </Router>
      </div>
    </div>
  );
}

