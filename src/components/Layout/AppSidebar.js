import React from "react";

export default function AppSidebar() {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <img
          src="https://content.jdmagicbox.com/comp/bangalore/73/080ppe03673/catalogue/velankani-software-pvt-ltd-electronic-city-bangalore-computer-software-developers-2rgz2h5-250.jpg"
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
              <a href="/" className="nav-link">
                <i className="nav-icon fas fa-users"></i>
                <p>
                  Accounts
                  <i className="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li class="nav-item">
                  <a href="!" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Test</p>
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
