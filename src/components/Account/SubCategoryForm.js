import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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

  const history = useHistory();

  useEffect(() => {
    console.log("Initial Data:", initialData);
    console.log("Mode:", mode);
    if (mode === "edit" && initialData && initialData.name) {
      setName(initialData.name);
      if (initialData.category) {
        setCategoryId(initialData.category.id);
      } else {
        setCategoryId("");
      }
    }
  }, [mode, initialData]);

  const handleSubmit = async () => {
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

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <div>
      <form>
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
        <hr />
      </form>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          style={{ marginLeft: "70%" }}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          data-bs-dismiss="modal"
        >
          {mode === "edit" ? "Save" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SubCategoryForm;
