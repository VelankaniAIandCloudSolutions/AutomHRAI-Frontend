import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

function CreateContractWorker() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    emp_id: "",
    phone_number: "",
    dob: "",
    company: "",
    agency: "",
  });
  const [userImages, setUserImages] = useState([]);
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const history = useHistory();
  const [requiredFields, setRequiredFields] = useState([
    "first_name",
    "email",
    "password",
  ]);
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  useEffect(() => {
    // Fetch agency and location data
    const fetchAgencies = async () => {
      try {
        const response = await axios.get("/accounts/contract-workers/create/");
        console.log(response.data);
        setAgencies(response.data.agencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAgencies();
  }, []);

  const handleCapturePhoto = () => {
    const constraints = {
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setVideoStream(stream);
        setShowModal(true);
        // Set the video stream as the source for the video element
        const video = document.getElementById("videoPreview");
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const handleSavePhoto = () => {
    const video = document.getElementById("videoPreview");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Create a new File object from the captured image data
    const byteString = atob(dataUrl.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: "image/jpeg" });
    const file = new File([blob], "captured_image.jpeg");

    // Optionally display the captured image
    // You can create an <img> element and set its src to dataUrl

    // Stop video stream
    videoStream.getTracks().forEach((track) => track.stop());

    // Hide modal
    setShowModal(false);

    // Trigger a file upload event programmatically
    const inputEvent = new Event("input", { bubbles: true });
    Object.defineProperty(fileInputRef.current, "files", {
      value: [file],
      writable: true,
    });
    fileInputRef.current.dispatchEvent(inputEvent);
  };

  const handleChange = (e) => {
    const { id, type } = e.target;
    let value = e.target.value;

    // If the input is a file input and it's for user images, get the file object(s)
    let files = null;
    if (type === "file" && id === "user_images") {
      files = Array.from(e.target.files);
      // Set value to the array of file names for display purposes, if needed
      value = files.map((file) => file.name).join(",");
      setUserImages(files);
    } else if (type === "file" && id === "aadhaar_card") {
      setAadhaarCard(e.target.files[0]);
    } else if (type === "file" && id === "pan") {
      setPanCard(e.target.files[0]);
    } else {
      // If the input is not a file input, update form data state directly
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleCreateUser = () => {
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    userImages.forEach((image) => {
      formDataToSend.append("user_images", image);
    });

    if (aadhaarCard) {
      formDataToSend.append("aadhaar_card", aadhaarCard);
    }

    if (panCard) {
      formDataToSend.append("pan", panCard);
    }

    dispatch(showLoading());
    axios
      .post("/accounts/contract-workers/create/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("Contract Worker created successfully:", response.data);
        toast.success("Contract Worker created successfully");
        history.push("/contract-workers");
        dispatch(hideLoading());
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating user:", error);
        toast.error("Error Creating Contract Worker");
        dispatch(hideLoading());
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
                <h2 className="mb-0">Contract Workers</h2>
                <span className="ms-3 fs-4 text-muted">|</span>
                <nav aria-label="breadcrumb" className="mt-3">
                  <ol className="breadcrumb bg-transparent">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/contract-workers">
                        <i className="fas fa-users"></i> Contract Workers
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-user-plus"></i> Create Worker
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button className="btn btn-primary" onClick={handleCreateUser}>
                <i className="fas fa-user-plus"></i> Create Worker
              </button>
            </div>
          </div>
          <div className="card-container mt-4">
            <div className="card">
              <h5 className="card-header">Contract Worker Information</h5>
              <div className="card-body">
                <div className="form-container">
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label htmlFor="first_name" className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="last_name" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label htmlFor="emp_id" className="form-label">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="emp_id"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_number"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6 ">
                      <label htmlFor="agency" className="form-label">
                        Agency
                      </label>
                      {agencies && agencies.length > 0 && (
                        <select
                          className="form-select"
                          id="agency"
                          value={formData.agency}
                          onChange={handleChange}
                        >
                          <option value="">Select Agency</option>
                          {agencies.map((agency, index) => (
                            <option key={index} value={agency.id}>
                              {agency.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="dob" className="form-label">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="dob"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3 mb-2">
                    <div className="col-md-6">
                      <label htmlFor="user_images" className="form-label">
                        Image Upload
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="user_images"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        ref={fileInputRef}
                      />
                    </div>
                    <div className="col-md-6">
                      <button
                        className="btn btn-primary"
                        onClick={handleCapturePhoto}
                      >
                        Capture Photo from Webcam
                      </button>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="aadhaar_card" className="form-label">
                        Aadhaar Card
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="aadhaar_card"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="pan" className="form-label">
                        PAN Card
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="pan"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Modal for displaying video stream */}
                  {showModal && (
                    <div
                      className="modal"
                      tabIndex="-1"
                      role="dialog"
                      style={{ display: "block" }}
                    >
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Capture Photo</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <video
                              id="videoPreview"
                              width="100%"
                              autoPlay
                            ></video>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSavePhoto}
                            >
                              Save Photo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateContractWorker;
