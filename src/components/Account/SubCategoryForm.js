import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
      setCategoryId(initialData.category.id);
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
      dispatch(showLoading());
      let response;
      // Make POST request to create a new subcategory
      if (mode === "create") {
        response = await axios.post("/accounts/sub-categories/", {
          name: name,
          categoryId: categoryId,
        });
      } else if (mode === "edit" && initialData) {
        // Make PUT request to update the existing subcategory
        response = await axios.put(
          `/accounts/sub-categories/edit/${initialData.id}/`,
          {
            name: name,
            categoryId: categoryId,
          }
        );
      }

      // Handle response
      if (response.status >= 200 && response.status < 300) {
        toast.success(
          `${
            mode === "create" ? "Subcategory created" : "Subcategory updated"
          } successfully`
        );
        setName("");
        setCategoryId("");
        const newSubCategories = response.data;
        onSubCategoryCreated(newSubCategories);
      } else {
        toast.error(
          `Error ${mode === "create" ? "creating" : "updating"} Subcategory`
        );
      }
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} Subcategory:`,
        error
      );
      toast.error(
        `Error ${mode === "create" ? "creating" : "updating"} Subcategory`
      );
    } finally {
      dispatch(hideLoading());
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
        {categories && categories.length > 0 && (
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
        )}
      </div>
      <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
        {mode === "edit" ? "Update Subcategory" : "Create Subcategory"}
      </button>
    </form>
  );
};

export default SubCategoryForm;
