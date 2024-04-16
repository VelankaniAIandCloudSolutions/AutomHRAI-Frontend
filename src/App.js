import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import LoadingScreen from "./components/Layout/LoadingScreen";
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
import CheckInCheckOutNew from "./pages/FaceRecognition/CheckInCheckOutNew";
import RankCandidates from "./pages/CandidateRanking/RankCandidates";
import MyComponent from "./pages/FaceRecognition/checkintest";
import { Login } from "./pages/Accounts/LogIn";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TestPage from "./pages/TestPage";
import ContractWorkers from "./pages/Accounts/ContractWorkers";
import CreateContractWorker from "./pages/Accounts/CreateContractWorker";
import ProjectLanding from "./pages/Accounts/ProjectLanding";

import Locations from "./pages/Accounts/Locations";
import Category from "./pages/Accounts/Category"

export default function App() {
  const authState = useSelector((state) => state.auth);
  const isStaff = authState.userData?.user_account?.is_staff;
  console.log("isStaff App.js====", isStaff);
  const isSuperuser = authState.userData?.user_account?.is_superuser;
  console.log("isSuperuser App.js", isSuperuser);
  const isActive = authState.userData?.user_account?.is_active;

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  if (isAuth) {
    return (
      <Router>
        <div className="wrapper">
          <AppHeader />
          <AppSidebar />
          <div className="content-wrapper">
            <Switch>
              <Route path="/" exact component={Dashboard} />
              <Route path="/login" exact component={Login} />
              <Route path="/load" exact component={LoadingScreen} />
              <Route path="/checkin" exact component={CheckInCheckOut} />
              <Route
                path="/checkin-checkout"
                exact
                component={CheckInCheckOutNew}
              />
              <Route path="/attendance" exact component={attendanceList} />

              <Route path="/contract-workers">
                {isSuperuser ? (
                  <>
                    <Route
                      path="/contract-workers/create-contract-worker"
                      exact
                      component={CreateContractWorker}
                    />
                    <Route
                      path="/contract-workers/edit-contract-worker/:id"
                      exact
                      component={EditUser}
                    />
                    <Route
                      path="/contract-workers"
                      exact
                      component={ContractWorkers}
                    />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/projects">
                {isSuperuser ? (
                  <>
                    {/* <Route
                      path="/projects/create-contract-worker"
                      exact
                      component={CreateContractWorker}
                    /> */}
                    {/* <Route
                      path="/projects/edit-project/:id"
                      exact
                      component={EditUser}
                    /> */}
                    <Route path="/projects" exact component={ProjectLanding} />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route path="/users">
                {isSuperuser ? (
                  <>
                    <Route
                      path="/users/create-user"
                      exact
                      component={CreateUser}
                    />
                    <Route
                      path="/users/edit-user/:id"
                      exact
                      component={EditUser}
                    />
                    <Route path="/users" exact component={Users} />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              <Route path="/">
                {isStaff || isSuperuser ? (
                  <>
                    <Route
                      path="/resume-details"
                      exact
                      component={ResumeDetails}
                    />
                    <Route
                      path="/candidate-list"
                      exact
                      component={Candidates}
                    />
                    <Route path="/job-groups" exact component={Jobgroups} />
                    <Route path="/jobs" exact component={Jobs} />
                    <Route
                      path="/rank-candidates"
                      exact
                      component={RankCandidates}
                    />
                    <Route
                      path="/test-component"
                      exact
                      component={MyComponent}
                    />
                    <Route
                      path="/employee-attendance"
                      exact
                      component={EmployeeAttendance}
                    />

                    <Route path="/locations" exact component={Locations} />
                    <Route path="/categories" exact component={Category} />


                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>

              {/* <Redirect to="/" />  */}
            </Switch>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="colored"
        />
      </Router>
    );
  } else {
    return <Login />;
  }
}
