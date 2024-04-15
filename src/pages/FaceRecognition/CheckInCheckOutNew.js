import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import ContractWorkerAttendanceGrid from "../../components/FaceRecognition/ContractWorkerAttendanceGrid";

export default function CheckInCheckOutNew() {
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [attendamceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    setupCamera();
    getContractWorkerAttendance(selectedDate);
    const modal = modalRef.current;
    if (modal) {
      new Modal(modal);
    }
  }, []);

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
            setIsLoading(false);
            if (response.data.message) {
              toast.success(response.data.message);
            } else {
              toast.error(response.data.error || "Failed to detect user");
            }
            setTimeout(() => {
              window.location.reload();
            }, 3000);
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

  return (
    <>
      <div className="container">
        {isLoading && <LoadingScreen />}
        <div className="d-flex align-items-center">
          <h1>Attendance</h1>
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
          <div className="card-header">Mark Attendnace</div>
          <div className="card-body">
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
            <input
              type="date"
              value={selectedDate}
              onChange={handleChange}
              className="form-control"
              style={{ width: "200px" }}
            />
          </div>
          <div className="card-body">
            <ContractWorkerAttendanceGrid attendanceData={attendamceData} />
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
                Mark Attendnace
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
    </>
  );
}
