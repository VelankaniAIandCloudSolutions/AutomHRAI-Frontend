import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from '../../actions/authActions'; // Import your actions
export default function AppSidebar() {
  const dispatch = useDispatch(); // Get the dispatch function

  // const userrole=JSON.parse(localStorage.getItem('userAccount'));
  // console.log(userrole)
  // const isStaff = userrole.user_account.is_staff;
  // const isSuperuser = userrole.user_account.is_superuser;

  // const userrole=useSelector((state)=>state.loggedIn.loggedIn);
  // console.log(userrole)
  const authState = useSelector((state) => state.auth);
  console.log("Redux State:", authState);

  const isStaff = authState.userData?.user_account?.is_staff;
  const isSuperuser = authState.userData?.user_account?.is_superuser;
  console.log("isStaff", isStaff);
  console.log("isSuper user",isSuperuser);
  


  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/" className="brand-link">
        <img
          src="/automhrlogo.png"
          alt="AutomHR Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">AutomHR</span>
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
           
{(isStaff && isSuperuser)&&(
  <>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-user"></i>
                <p>
                  Accounts
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/users" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Users</p>
                  </Link>
                </li>
              </ul>
            </li>            
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-file"></i>
                <p>
                  Resume Parser
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/resume-details" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Resumes</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Candidate Ranking
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/candidate-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Candidates</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/job-groups" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Job Groups</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/jobs" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Jobs</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/rank-candidates" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Rank Candidates</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-camera-retro"></i>
                <p>
                  Face Recognition
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/attendance" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Attendance</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/checkin" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Check In / Check Out</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/employee-attendance" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Employee Attendance</p>
                  </Link>
                </li>
              </ul>
            </li>
            </>
  )}
  {(isStaff && !isSuperuser)&&(
  <>
                       
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-file"></i>
                <p>
                  Resume Parser
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/resume-details" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Resumes</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Candidate Ranking
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/candidate-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Candidates</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/job-groups" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Job Groups</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/jobs" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Jobs</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/rank-candidates" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Rank Candidates</p>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-camera-retro"></i>
                <p>
                  Face Recognition
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/attendance" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Attendance</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/checkin" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Check In / Check Out</p>
                  </Link>
                </li>
              </ul>
            </li>
            </>
  )}

{(!isStaff && !isSuperuser)&&(
  <>
            <li className="nav-item has-treeview">
              <Link to="#" className="nav-link">
                <i className="nav-icon fas fa-camera-retro"></i>
                <p>
                  Face Recognition
                  <i className="right fas fa-angle-left"></i>
                </p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/attendance" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Attendance</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/checkin" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Check In / Check Out</p>
                  </Link>
                </li>
              </ul>
            </li>
            </>
  )}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
