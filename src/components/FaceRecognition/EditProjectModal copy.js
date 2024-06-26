import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

const Backdrop = ({ show, handleClose }) => {
  return (
    <div
      className={`modal-backdrop fade ${show ? "show" : ""}`}
      style={{ display: show ? "block" : "none" }}
      onClick={handleClose} // Clicking on backdrop closes the modal
    ></div>
  );
};

const EditProjectModal = ({
  // show,
  // handleClose,
  locations,
  categories,
  project,
  fetchAllProjects,
}) => {
  useEffect(() => {
    console.log("Row Data:", project);
    console.log("Locations:", locations);
    console.log("categories:", categories);
    if (project) {
      setName(project.name || "");
      const locationObj = locations.find(
        (loc) => loc.name === project.location
      );
      setLocation(project.location.id);
      setCategory(project.category.id);
    }
    setProjectId(project.id);
  }, [project, locations]);

  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event, project) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Location:", location);
    console.log("Category:", category);
    console.log("Id:", projectId);
    dispatch(showLoading());
    try {
      const response = await axios.put(
        `/accounts/projects/edit/${projectId}/`,
        {
          name,
          location,
          category,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Project created successfully");

        setName("");
        setLocation("");
        setCategory("");
        const newProjects = response.data.projects;
        dispatch(hideLoading());
        handleClose();

        toast.success("Project Edited successfully");
        fetchAllProjects();
      } else {
        console.error("Failed to create project");
        dispatch(hideLoading());
        toast.error("Error Creating Project");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Error Creating Project");
    }
  };

  return (
    <div>
      {show && <Backdrop show={show} handleClose={handleClose} />}
      <div
        className={`modal fade ${show ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Project</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location:
                  </label>
                  <select
                    className="form-select"
                    id="location"
                    value={location}
                    onChange={handleLocationChange}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc, index) => (
                      <option key={index} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category:
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-end">
                  {" "}
                  {/* Align button to the right */}
                  <button type="submit" className="btn btn-primary">
                    Edit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
