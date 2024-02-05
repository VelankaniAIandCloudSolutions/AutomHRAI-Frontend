import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/Layout/AppHeader";
import AppSidebar from "./components/Layout/AppSidebar";
import attendanceList from './pages/attendanceList';
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import CheckInCheckOut from "./pages/CheckInCheckOut";

export default function App() {
  return (
    <div className="wrapper">
      <AppHeader />
      <AppSidebar />
      <div className="content-wrapper">
        <Router>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/attendance" component={attendanceList}/>
            <Route path="/users/create-user" component={CreateUser}/>
            <Route path="/users/edit-user" component={EditUser}/>
            <Route path="/users" component={Users}/>
            <Route path="/checkin"component={CheckInCheckOut}/>
          </Switch>
        </Router>
      </div>
    </div>
  );
}
