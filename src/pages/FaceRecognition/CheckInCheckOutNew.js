import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";
import DigitalClock from "../../components/Layout/DigitalClock";
import { useSelector } from "react-redux";

export default function CheckInCheckOutNew() {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [attendamceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState([]);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const userDetails = authState.userData?.user_account;

  useEffect(() => {
    setupCamera();
    getContractWorkerAttendance(selectedDate);
    const modal = modalRef.current;
    if (modal) {
      new Modal(modal);
    }
  }, [selectedDate]);

  const handleChange = (event) => {
    setSelectedDate(event.target.value);
    getContractWorkerAttendance(event.target.value);
  };
  const getContractWorkerAttendance = async (date) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "facial-recognition/get_contract_worker_attendance",
        {
          date,
        }
      );
      setAttendanceData(response.data.checks_breaks);
      setProjects(response.data.projects);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching contract worker attendance:", error);
    }
  };

  const handleCapture = async (type) => {
    if (!videoStream) return;
    setTimeout(async () => {
      const track = videoStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      try {
        const blob = await imageCapture.takePhoto();
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.className = "captured-image";
        imageRef.current.innerHTML = "";
        imageRef.current.appendChild(img);

        videoRef.current.classList.add("not-visible");

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64data = reader.result;

          const fd = new FormData();
          fd.append("photo", base64data);
          fd.append("type", type);
          setIsLoading(true);
          try {
            const response = await axios.post(
              "facial-recognition/mark_attendance_without_login/",
              fd
            );
            console.log(response.data);
            if (response.data.task_id) {
              checkTaskStatus(response.data.task_id);
            } else {
              setIsLoading(false);
              toast.error(
                response.data.error || "Failed to process the request"
              );
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error("Failed to detect user");
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }
        };
      } catch (error) {
        console.log("takePhoto() error: ", error);
        toast.error(
          "Failed to capture photo, please make sure your camera is working"
        );
        closeModal();
      }
    }, 2000);
  };
  const checkTaskStatus = async (task_id) => {
    let interval;
    try {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `facial-recognition/get_classify_face_task_result/${task_id}`
          );
          const data = response.data;
          console.log(data);
          if (data.status === "SUCCESS") {
            clearInterval(interval);
            setIsLoading(false);
            toast.success(data.message);
            setTimeout(() => {
              window.location.reload();
            }, 3000);
            getContractWorkerAttendance(selectedDate);
          } else if (data.status === "FAILURE") {
            clearInterval(interval);
            setIsLoading(false);
            toast.warning(data.message);
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          } else if (data.status === "PROCESSING") {
            console.log("Task is still processing...");
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occured, please try again");
          if (error.message) {
            toast.error(error.message);
          }
          clearInterval(interval);
          setIsLoading(false);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }, 5000);
    } catch (error) {
      clearInterval(interval);
      console.log("Polling error: ", error);
      setIsLoading(false);
      toast.error("Error while checking the task status");
    }
  };
  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      const bsModal = Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
        const backdrops = document.querySelectorAll(
          ".modal-backdrop fade show"
        );
        backdrops.forEach((backdrop) => {
          backdrop.parentNode.removeChild(backdrop);
        });
      }
    }
  };
  const setupCamera = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia is not supported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setVideoStream(stream);
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.log("Something went wrong with getUserMedia: ", error);
      });
  };

  const handleSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleProjectSelectChange = (event) => {
    setSelectedProject(event.target.value);
    console.log("event value", event.target.value);
  };

  const submitAssignProject = async () => {
    if (selectedProject === "") {
      toast.error("Please select a project");
      return;
    }
    console.log("selectde project", selectedProject);
    const formData = {
      selected_attendance_entries: JSON.stringify(selectedRows),
      project_id: selectedProject,
    };
    console.log("formData", formData);
    setIsLoading(true);
    await axios
      .post("facial-recognition/assign_project/", formData)
      .then((response) => {
        setIsLoading(false);
        console.log(response.data);
        toast.success(response.data.message);
        getContractWorkerAttendance();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast.error("An error occured, please try again later ");
      });
  };

  return (
    <>
      <div className="container">
        {isLoading && <LoadingScreen />}
        <div className="d-flex align-items-center py-3">
          <h2 className="mb-0">Attendance</h2>
          <span className="ms-3 fs-4 text-muted">|</span>
          <nav aria-label="breadcrumb" className="d-inline-block ms-3">
            <ol className="breadcrumb bg-transparent m-0 p-0">
              <li className="breadcrumb-item">
                <a href="/">
                  <i className="fas fa-home"></i> Home
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <i className="fas fa-users"> </i> Attendance
              </li>
            </ol>
          </nav>
        </div>
        <div className="card">
          <div className="card-header">Mark Attendance</div>
          <div className="card-body">
            <div className="row mb-2">
              <DigitalClock />
            </div>
            <div className="row justify-content-around">
              <div className="col-auto">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("checkin")}
                  className="btn btn-primary"
                >
                  <i className="fas fa-user-check me-1"></i>
                  Check In
                </button>
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("checkout")}
                >
                  <i className="fas fa-user-clock me-1"></i>
                  Check Out
                </button>
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("breakin")}
                >
                  <i className="fas fa-coffee me-1"></i>
                  Break In
                </button>
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("breakout")}
                >
                  <i className="fas fa-coffee me-1"></i>
                  Break Out
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="me-auto">Attendance Details</h6>
            <div className="d-flex">
              {userDetails?.is_supervisor_admin && (
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#assignProjectModal"
                  disabled={selectedRows.length === 0}
                >
                  Assign Project
                </button>
              )}
              <input
                type="date"
                value={selectedDate}
                onChange={handleChange}
                className="form-control"
                style={{ width: "200px" }}
              />
            </div>
          </div>
          <div className="card-body">
            <ContractWorkerAttendanceGrid
              attendanceData={attendamceData}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Mark Attendance
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <video
                  autoPlay={true}
                  id="video-element"
                  ref={videoRef}
                  style={{ width: 320, height: 240 }}
                ></video>
              </div>

              <div id="img-element" ref={imageRef}></div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="assignProjectModal"
        tabIndex="-1"
        aria-labelledby="assignProjectModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assignProjectModalLabel">
                Assign Project
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
                <label htmlFor="select" className="form-label">
                  Select a Project
                </label>
                <select
                  id="select"
                  className="form-select"
                  onChange={handleProjectSelectChange}
                  value={selectedProject}
                >
                  <option value={""}> Select a Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.category.name} -
                      {project.location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                data-bs-dismiss="modal"
                type="button"
                className="btn btn-primary"
                onClick={() => submitAssignProject(selectedProject)}
              >
                Assign
              </button>
              <button
                data-bs-dismiss="modal"
                type="button"
                className="btn btn-danger"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
