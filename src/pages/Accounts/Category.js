import LoadingScreen from "../../components/Layout/LoadingScreen";
import CategoryAgGrid from "../../components/Category/CategoryAgGrid";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Categories = () => {
  const loading = useSelector((state) => state.loading.loading);
  const [category, setCategory] = useState("");
  const [rowData, setrowData] = useState([]);
  const history = useHistory();

  const handleLocationChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    // Fetch locations when component mounts
    fetchCategory();
  }, []);

  const fetchCategory = () => {
    axios
      .get("/accounts/categories/create/")
      .then((response) => {
        setrowData(response.data);

        console.log(" the categories", response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) {
      return;
    }
    axios
      .delete(`/accounts/categories/delete/${id}/`)
      .then((response) => {
        console.log("Location deleted successfully:", response.data);
        fetchCategory();
        toast.success("Location deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting location:", error);
      });
  };

  const handleSubmit = () => {
    if (!category.trim()) {
      toast.error(" Error : Category Field cannot be empty");
      return;
    }
    axios
      .post("/accounts/categories/create/", { category })
      .then((response) => {
        console.log("Location submitted successfully:", response.data);
        fetchCategory();
        toast.success("Category created successfully");
      })
      .catch((error) => {
        console.error("Error submitting location:", error);
        toast.error("Error creating category");
      });
  };

  return (
    <div className="container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="row align-items-center">
            <div className="col-md-9 mt-4">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Categories</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home me-1"></i>Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-list-alt me-1"></i>
                      Categories
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                <i className="fas fa-plus"></i> Create Category
              </button>
            </div>
          </div>
        </>
      )}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create Category
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="categoryInput" className="form-label">
                  Enter Category:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryInput"
                  value={category}
                  onChange={handleLocationChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: "25px" }}>
        <CategoryAgGrid
          rowData={rowData}
          onDeleteClick={handleDeleteClick}
          fetchCategory={fetchCategory}
        />
      </div>
    </div>
  );
};

export default Categories;
