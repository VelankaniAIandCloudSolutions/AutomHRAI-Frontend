import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import RankCandidates from "./pages/CandidateRanking/RankCandidates";
import MyComponent from "./pages/FaceRecognition/checkintest";
import { Login } from "./pages/Accounts/LogIn";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function App() {
  const authState = useSelector((state) => state.auth);
  const isStaff = authState.userData?.user_account?.is_staff;
  const isSuperuser = authState.userData?.user_account?.is_superuser;


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
              <Route path="/load" component={LoadingScreen}/>
              
            {/* {isSuperuser && (
              <> */}
              <Route path="/users/create-user" component={CreateUser} />
              <Route path="/users/edit-user/:id" component={EditUser} />
              <Route path="/users" component={Users} />
              {/* </>
            )} */}
                      {/* {isStaff && isSuperuser && (
<> */}
<Route path="/resume-details" component={ResumeDetails} />
              <Route path="/candidate-list" exact component={Candidates} />
              <Route path="/job-groups" exact component={Jobgroups} />
              <Route path="/jobs" exact component={Jobs} />
              <Route path="/rank-candidates" component={RankCandidates} />
              <Route path="/test-component" component={MyComponent} />
              <Route path="/employee-attendance" exact component={EmployeeAttendance}/>
              {/* </>
               )} */}
               
              <Route path="/checkin" component={CheckInCheckOut} />
              <Route path="/attendance" component={attendanceList} />
              

                     
              
            </Switch>
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </Router>
    );
  } else {
    return <Login />;
  }
}
