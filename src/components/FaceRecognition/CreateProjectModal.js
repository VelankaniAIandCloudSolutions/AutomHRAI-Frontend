import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import { useHistory } from "react-router-dom";

const CreateProjectFields = ({ locations, categories, onProjectCreated }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const history = useHistory();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Location:", location);
    console.log("Category:", category);
    dispatch(showLoading());
    try {
      const response = await axios.post("/accounts/projects/create/", {
        name,
        location,
        category,
      });

      // Check if response is successful (you may need to adjust this based on your API's response format)
      if (response.status >= 200 && response.status < 300) {
        console.log("Project created successfully");

        setName("");
        setLocation("");
        setCategory("");
        const newProjects = response.data.projects;
        onProjectCreated(newProjects);
        dispatch(hideLoading());
        
        
        toast.success("Project created successfully");
        
        
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
        {/* <hr style={{ border: "0.01px solid black" }} /> */}
        <hr></hr>

        <div className="text-end">
          <button
            className="btn btn-secondary"
            style={{ marginRight: "2%" }}
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectFields;
