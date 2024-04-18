import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

const SubCategoryForm = ({
  categories,
  onSubmit,
  mode,
  initialData,
  onSubCategoryCreated,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.name);
      setCategoryId(initialData.category);
    }
  }, [mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation
    if (!name || !categoryId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Make POST request to create a new subcategory
      const response = await axios.post("/accounts/sub-categories/", {
        name: name,
        categoryId: categoryId,
      });

      // Handle response
      if (response.status >= 200 && response.status < 300) {
        // Call onSubmit function with form data
        // onSubmit({ name, categoryId });
        // Clear form fields after successful submission
        toast.success("Subcategory created successfully");
        setName("");
        setCategoryId("");
        console.log();
        const newSubCategories = response.data;
        console.log(" these are the new sub categories", newSubCategories);
        onSubCategoryCreated(newSubCategories);
        dispatch(hideLoading());
        // Display success message
      } else {
        // Handle error
        alert("Error creating Subcategory");
        dispatch(hideLoading());
        toast.error("Error Creating Subcategory");
      }
    } catch (error) {
      console.error("Error creating Subcategory:", error);

      toast.error("Error Creating  Subcategory");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          className="form-select"
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
        Create Subcategory
      </button>
    </form>
  );
};

export default SubCategoryForm;
