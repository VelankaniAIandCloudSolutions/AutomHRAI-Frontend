import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";
import Webcam from "react-webcam";

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
  const [isConfirmingSave, setIsConfirmingSave] = useState(true);
  const history = useHistory();
  const [requiredFields, setRequiredFields] = useState([
    "first_name",
    "email",
    "password",
  ]);
  // Define a state variable to hold the selected image option
  const [imageOption, setImageOption] = useState("upload"); // Defaulting to 'upload'

  // Function to handle radio button change and update the selected image option
  const handleImageOptionChange = (option) => {
    setImageOption(option);
  };
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    // Fetch agency and location data
    setupCamera();
    const modal = modalRef.current;
    if (modal) {
      new Modal(modal);
    }

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

  const handleCapture = () => {
    const modal = modalRef.current;

    if (modal) {
      const bsModal = Modal.getInstance(modal);
      if (bsModal) {
        bsModal.show();
      }
    }

    // Clear previous captured image
    setCapturedImage(null);
    imageRef.current.innerHTML = "";
    videoRef.current.classList.remove("not-visible");
    setIsConfirmingSave(true);
  };
  const handleSavePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      // Log the captured image Blob
      console.log("Captured image Blob:", blob);

      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.className = "captured-image";
      imageRef.current.innerHTML = "";
      imageRef.current.appendChild(img);

      // Set the captured image in state
      setIsConfirmingSave(false);
      setCapturedImage(blob);
      const file = new File([blob], "captured_photo.jpg", {
        type: blob.type,
      });
      console.log("User images array before setting:", [file]);

      console.log("User images array after setting:", [file]);

      // Hide the live stream
      videoRef.current.classList.add("not-visible");
    }, "image/jpeg");
  };
  const handleConfirmSave = () => {
    // Logic to save the captured image
    // For now, I'm just logging the image blob
    console.log("Captured image Blob:", capturedImage);

    const modal = modalRef.current;

    if (modal) {
      const bsModal = Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
    }
    // Create a file object from the blob
    const file = new File([capturedImage], "captured_photo.jpg", {
      type: capturedImage.type,
    });
    setUserImages([file]);
    setIsConfirmingSave(true);

    // Reset the button text
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
                        Agency <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="agency"
                        value={formData.agency}
                        onChange={handleChange}
                      >
                        {agencies && agencies.length > 0 ? (
                          <>
                            <option value="">Select Agency</option>
                            {agencies.map((agency, index) => (
                              <option key={index} value={agency.id}>
                                {agency.name}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="" disabled>
                            No agencies available
                          </option>
                        )}
                      </select>
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
                      <label className="form-label">
                        Choose Contract Worker Image
                      </label>
                      <div>
                        <input
                          type="radio"
                          id="upload_image"
                          name="image_option"
                          value="upload"
                          checked={imageOption === "upload"}
                          onChange={() => setImageOption("upload")}
                        />
                        <label
                          htmlFor="upload_image"
                          style={{ marginLeft: "5px", fontWeight: "normal" }}
                        >
                          Upload Image
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="capture_photo"
                          name="image_option"
                          value="capture"
                          checked={imageOption === "capture"}
                          onChange={() => setImageOption("capture")}
                        />
                        <label
                          htmlFor="capture_photo"
                          style={{ marginLeft: "5px", fontWeight: "normal" }}
                        >
                          Capture Photo from Webcam
                        </label>
                      </div>
                    </div>

                    {imageOption === "upload" ? (
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
                    ) : (
                      <div className="col-md-6">
                        <button
                          className="btn btn-link mt-2"
                          onClick={handleCapture}
                        >
                          {" Capture Image "}
                          <i className="fas fa-camera ml-1"></i>
                          {/* Font Awesome camera icon */}
                        </button>
                        {isConfirmingSave && capturedImage && (
                          <div>
                            <span>captured_photo.jpg</span>
                            <a
                              href={URL.createObjectURL(capturedImage)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-link"
                            >
                              View
                            </a>
                          </div>
                        )}
                      </div>
                    )}

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
                </div>
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
                    Capture Image
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

                  {isConfirmingSave ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleSavePhoto}
                    >
                      Take Photo
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleConfirmSave}
                    >
                      Confirm Photo
                    </button>
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
