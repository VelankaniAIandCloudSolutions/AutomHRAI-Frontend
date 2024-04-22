import React, { useState } from "react";
import { Link } from "react-router-dom";

const SidebarMenuItem = ({ title, icon, items }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <li className={`nav-item has-treeview ${open ? "menu-open" : ""}`}>
      <Link to="#" className="nav-link" onClick={toggleOpen}>
        <i className={`nav-icon ${icon}`}></i>
        <p>
          {title}
          <i className="right fas fa-angle-left"></i>
        </p>
      </Link>
      <ul className="nav nav-treeview">
        {items.map((item, index) => (
          <li className="nav-item" key={index}>
            <Link to={item.link} className="nav-link">
              <i className="far fa-circle nav-icon"></i>
              <p>{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default SidebarMenuItem;
