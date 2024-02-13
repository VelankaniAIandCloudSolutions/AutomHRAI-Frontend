import React from "react";
import { Link } from "react-router-dom";

export default function AppHeader() {
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
          <Link to="/" className="nav-link">
            <i className="fas fa-sign-out-alt"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
