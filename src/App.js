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
import EditContractWorker from "./pages/Accounts/EditContractWorker";
import ProjectLanding from "./pages/Accounts/ProjectLanding";
import Locations from "./pages/Accounts/Locations";
import Category from "./pages/Accounts/Category";
import Agency from "./pages/Accounts/Agency";
import axios from "axios";
import ContractWorkersAttendanceReport from "./pages/Accounts/ContractWorkersAttendanceReport";
import SubCategoryLanding from "./pages/Accounts/SubCategoryLanding";
import ContractWorkersTimesheet from "./pages/FaceRecognition/ContractWorkersTimesheet";
import FaceRecognitionReports from "./pages/FaceRecognition/FaceRecognitionReports";
export default function App() {
  const authState = useSelector((state) => state.auth);
  const userDetails = authState.userData?.user_account;
  console.log("dets", userDetails);
  // const isActive = authState.userData?.user_account?.is_active;

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    // if (localStorage.getItem("access_token") !== null) {
    if (localStorage.getItem("token") !== null) {
      setIsAuth(true);
      axios.defaults.headers.common["Authorization"] =
        "Token " + localStorage.getItem("token");
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
                path="/bulk-attendance-report"
                exact
                component={ContractWorkersAttendanceReport}
              />{" "}
              <Route
                path="/checkin-checkout"
                exact
                component={CheckInCheckOutNew}
              />
              <Route
                path="/face-recognition-reports"
                exact
                component={FaceRecognitionReports}
              />
              <Route path="/attendance" exact component={attendanceList} />
              <Route path="/contract-workers">
                {userDetails?.is_supervisor_admin ||
                userDetails?.is_superuser ? (
                  <>
                    <Route
                      path="/contract-workers/create-contract-worker"
                      exact
                      component={CreateContractWorker}
                    />
                    {/* <Route
                      path="/contract-workers/edit-contract-worker/:id"
                      exact
                      component={EditUser}
                    /> */}
                    <Route
                      path="/contract-workers/edit-contract-worker/:id"
                      exact
                      component={EditContractWorker}
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
              <Route path="/sub-categories">
                {userDetails?.is_supervisor_admin ||
                userDetails?.is_superuser ? (
                  <>
                    <Route
                      path="/sub-categories"
                      exact
                      component={SubCategoryLanding}
                    />
                    <Route
                      path="/contract-workers/edit-contract-worker/:id"
                      exact
                      component={EditUser}
                    />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/sub-categories">
                {userDetails?.is_supervisor_admin ||
                userDetails?.is_superuser ? (
                  <>
                    <Route
                      path="/sub-categories"
                      exact
                      component={SubCategoryLanding}
                    />
                    <Route
                      path="/contract-workers/edit-contract-worker/:id"
                      exact
                      component={EditUser}
                    />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/projects">
                {userDetails?.is_supervisor_admin ||
                userDetails?.is_superuser ? (
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
                {userDetails?.is_superuser ? (
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
                {userDetails?.is_supervisor_admin ||
                userDetails?.is_superuser ? (
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

                    <Route path="/add-agencies" exact component={Agency} />
                    <Route
                      path="/contract-workers-timesheet"
                      exact
                      component={ContractWorkersTimesheet}
                    />
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
