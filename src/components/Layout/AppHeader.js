import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../actions/authActions";

export default function AppHeader() {
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      // const { data } = await axios.post("/logout/", {
      //   refresh_token: localStorage.getItem("refresh_token"),
      // });
      const { data } = await axios.post("/token/logout/");
      dispatch(logoutAction());
      console.log(data);
      localStorage.clear();
      // localStorage.removeItem("access_token");
      // localStorage.removeItem("refresh_token");
      axios.defaults.headers.common["Authorization"] = null;

      window.location.href = "/login";
    } catch (e) {
      console.log("logout not working", e);
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="/" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            <i className="fas fa-home"></i>
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <span
            style={{ cursor: "pointer" }}
            onClick={logout}
            className="nav-link"
          >
            <i className="fas fa-sign-out-alt"></i>
          </span>
        </li>
      </ul>
    </nav>
  );
}
