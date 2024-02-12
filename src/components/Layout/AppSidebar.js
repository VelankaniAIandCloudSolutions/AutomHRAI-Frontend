import React from "react";
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AppSidebar() {
  

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <img
          src="/automhrlogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: 0.8 }}
        />
        <span className="brand-text font-weight-light">Autom HR</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <li className="nav-item text-left">
              <a href="#" className="nav-link"  >
                <i className="nav-icon fas fa-file"></i>
                <p>
                  Resume Parser
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="!" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Dashboard</p>
                  </a>
                </li>
                <li className="nav-item" >
                  <a href="/resume-details" className="nav-link" >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Resumes</p>            
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <li className="nav-item text-left">
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Candidate Matching
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="/candidate-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Candidates</p>
                  </a>
                </li>
                
                <li className="nav-item">
                  <a href="!" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Job Descriptions</p>           
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/job-groups" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Job Groups</p>
                  </a>
                </li>

                <li className="nav-item">
                  <a href="/jobs" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Jobs</p>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
