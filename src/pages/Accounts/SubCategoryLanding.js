import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import CreateProjectModal from "../../components/FaceRecognition/CreateProjectModal";
import SubCategoryAgGrid from "../../components/Account/SubCategoryAgGrid";
import SubCategoryForm from "../../components/Account/SubCategoryForm";
function SubCategoryLanding() {
  const [rowData, setRowData] = useState([]);

  const [category, setCategory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);

  const handleSubCategoryCreated = (newSubCategories) => {
    setRowData(newSubCategories);
  };

  const fetchAllSubCategories = async () => {
    dispatch(showLoading());
    await axios
      .get("/accounts/sub-categories")
      .then((response) => {
        console.log("api data", response.data);
        setRowData(response.data.subCategories);
        setCategory(response.data.categories);
        dispatch(hideLoading());
      })
      .catch((error) => console.error("Error fetching data:", error));
    dispatch(hideLoading());
  };

  useEffect(() => {
    fetchAllSubCategories();
  }, []);

  const handleAddNewSubCategory = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    try {
      const response = await axios.delete(
        `/accounts/sub-categories/delete/${subCategoryId}/`
      );
      if (response.status === 204) {
        console.log("Subcategory deleted successfully");
        toast.success("Subcategory deleted successfully");
        fetchAllSubCategories();
      } else {
        console.error("Unexpected status code:", response.status);
        toast.error("Error deleting Subcategory");
      }
    } catch (error) {
      console.error("Error deleting Subcategory:", error);
      toast.error("Error deleting Subcategory");
    }
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
                <h2 className="mb-0">Sub-Category</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-users"> </i> Sub-Categories
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#sampleModal"
                onClick={handleAddNewSubCategory}
              >
                <i className="fas fa-plus"> </i> Add Subcategory
              </button>
            </div>

            <div className="container" style={{ marginTop: "25px" }}>
              <SubCategoryAgGrid
                rowData={rowData}
                onDeleteSubCategory={handleDeleteSubCategory}
                categories={category}
                handleSubCategoryCreated={handleSubCategoryCreated}
              />
            </div>
            {/* <CreateProjectModal
              show={showModal}
              handleClose={() => setShowModal(false)}
              locations={location}
              categories={category}
              onProjectCreated={handleProjectCreated}
            /> */}
          </div>

          <div
            className="modal fade"
            id="sampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Create Sub Category
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <SubCategoryForm
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    categories={category} // Pass the array of category objects
                    // onSubmit={handleSubmit} // Pass the function to handle form submission
                    mode={mode} // Pass the mode of the form
                    // initialData={initialData} // Pass initial data when editing a subcategory
                    onSubCategoryCreated={handleSubCategoryCreated}

                    // Pass the function to handle subcategory creation
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SubCategoryLanding;
