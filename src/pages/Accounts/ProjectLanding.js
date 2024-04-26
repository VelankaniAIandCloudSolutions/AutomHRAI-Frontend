import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AgGridUserList from "../../components/FaceRecognition/AgGridUserList";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import AgGridContractWorkerList from "../../components/FaceRecognition/AgGridContractWorkerList";
import AgGridProjectList from "../../components/FaceRecognition/AgGridProjectList";
import CreateProjectModal from "../../components/FaceRecognition/CreateProjectModal";
import EditProjectModal from "../../components/FaceRecognition/EditProjectModal";

function Projects() {
  const [rowData, setRowData] = useState([]);
  const [location, setLocation] = useState([]);
  const [category, setCategory] = useState([]);
  // const [showCreateModal, setCreateShowModal] = useState(false);
  const [showEditModal, setEditShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);

  const handleProjectCreated = (newProjects) => {
    setRowData(newProjects);
  };

  const handleProjectEdited = () => {
    setEditShowModal(true);
  };

  const fetchAllProjects = async () => {
    dispatch(showLoading());
    await axios
      .get("/accounts/projects")
      .then((response) => {
        console.log("api data", response.data);
        setRowData(response.data.projects);
        setLocation(response.data.locations);
        setCategory(response.data.categories);
        dispatch(hideLoading());
      })
      .catch((error) => console.error("Error fetching data:", error));
    dispatch(hideLoading());
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  // const handleAddNewProject = () => {
  //   setCreateShowModal(true);
  // };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `/accounts/projects/delete/${projectId}/`
      );
      if (response.status === 204) {
        console.log("Project deleted successfully");
        toast.success("Project deleted successfully");
        fetchAllProjects();
      } else {
        console.error("Unexpected status code:", response.status);
        toast.error("Error deleting Project");
      }
    } catch (error) {
      console.error("Error deleting Project:", error);
      toast.error("Error deleting Project");
    }
  };

  const handleEditProject = (projectId) => {
    console.log("Edit project with ID:", projectId);
    const projectData = rowData.find((project) => project.id === projectId);
    if (projectData) {
      console.log("Project data:", projectData);
      setSelectedProject(projectData);
      setEditShowModal(true);
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
                <h2 className="mb-0">Projects</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="d-inline-block ms-3">
                  <ol className="breadcrumb bg-transparent m-0 p-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-project-diagram"> </i> Projects
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#CreateNewProjectModal"
                // onClick={handleAddNewProject}
              >
                <i className="fas fa-plus"> </i> Add New Project
              </button>
            </div>

            <div className="container" style={{ marginTop: "25px" }}>
              <AgGridProjectList
                rowData={rowData}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleEditProject}
              />
            </div>

            <EditProjectModal
              show={showEditModal}
              handleClose={() => setEditShowModal(false)}
              project={selectedProject}
              locations={location}
              categories={category}
              onEditProject={handleProjectEdited}
              fetchAllProjects={fetchAllProjects}
            />
          </div>
          <div
            className="modal"
            id="deletemodal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Delete User
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* create Project Modal */}

          <div
            className="modal"
            id="CreateNewProjectModal"
            tabindex="-1"
            aria-labelledby="CreateNewProjectModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id="CreateNewProjectModalLabel"
                  >
                    Create Project
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <CreateProjectModal
                    // show={showCreateModal}
                    // handleClose={() => setCreateShowModal(false)}
                    locations={location}
                    categories={category}
                    onProjectCreated={handleProjectCreated}
                  />
                </div>
                {/* <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-primary">
                    Save changes
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Projects;
