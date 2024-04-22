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
import { useParams } from "react-router-dom";

function EditContractWorker() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [formData, setFormData] = useState({
    worker: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      emp_id: "",
      phone_number: "",
      dob: "",
      agency: "",
      aadhaar_card: "", // Assume these are URLs to images or PDFs
      pan: "",
    },
    user_documents: [],
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [confirmedUploadedImages, setConfirmedUploadedImages] = useState([]);
  const [capturedImages, setCapturedImages] = useState([]);
  const [confirmedCapturedImages, setConfirmedCapturedImages] = useState([]);
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const history = useHistory();
  const [requiredFields, setRequiredFields] = useState([
    "first_name",
    "email",
    "password",
  ]);
  const [imageOption, setImageOption] = useState("upload");
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  const [newImages, setNewImages] = useState([]);

  const [allImages, setAllImages] = useState([]);
  const [showAadhaarCard, setShowAadhaarCard] = useState(false);
  const [showPanCard, setShowPanCard] = useState(false);

  useEffect(() => {
    setupCamera();
    const modal = modalRef.current;
    if (modal) {
      new Modal(modal);
    }

    const fetchContractWorkerDetails = async () => {
      try {
        const response = await axios.get(
          `/accounts/contract-workers/update/${id}/`
        );
        setFormData(response.data);
        console.log("the fetched worker data", response.data);

        // if (response.data.worker.aadhaar_card) {
        //   setAadhaarCardUrl(response.data.worker.aadhaar_card);
        // }

        // // Check if PAN Card is already uploaded
        // if (response.data.worker.pan) {
        //   setPanCardUrl(response.data.worker.pan);
        // }
      } catch (error) {
        console.error("Error fetching contract worker details:", error);
      }
    };

    const fetchAgencies = async () => {
      try {
        const response = await axios.get("/accounts/contract-workers/create/");
        setAgencies(response.data.agencies);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      }
    };

    fetchContractWorkerDetails();
    fetchAgencies();

    // const storedUserImages = JSON.parse(localStorage.getItem('userImages'));
    // if (storedUserImages) {
    //   setUserImages(storedUserImages);
    // }
  }, [id]);

  const fetchFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], url.substring(url.lastIndexOf("/") + 1));
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };

  useEffect(() => {
    const updatedImages = [
      ...formData.user_documents,
      ...confirmedUploadedImages,
      ...confirmedCapturedImages,
    ];
    setAllImages(updatedImages);
  }, [
    formData.user_documents,
    confirmedUploadedImages,
    confirmedCapturedImages,
  ]);

  const handleCapture = () => {
    const modal = modalRef.current;

    if (modal) {
      const bsModal = Modal.getInstance(modal);
      if (bsModal) {
        bsModal.show();
      }
    }

    setCapturedImage(null);
    imageRef.current.innerHTML = "";
    videoRef.current.classList.remove("not-visible");
  };

  const handleSavePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.className = "captured-image";
      imageRef.current.innerHTML = "";
      imageRef.current.appendChild(img);
      setCapturedImage(blob);
      const file = new File([blob], "captured_photo.jpg", {
        type: blob.type,
      });
      const files = [file];
      setCapturedImages((prevImages) => [...prevImages, ...files]);
      videoRef.current.classList.add("not-visible");
    }, "image/jpeg");
  };

  const setupCamera = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia is not supported");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.log("Something went wrong with getUserMedia: ", error);
      });
  };

  const handleChange = (e) => {
    const { id, type } = e.target;
    let value = e.target.value;

    let files = null;
    if (type === "file" && id === "user_images") {
      files = Array.from(e.target.files);
      value = files.map((file) => file.name).join(",");
      console.log("selected files for upload", files);
      setUploadedImages((prevImages) => [...prevImages, ...files]);
    } else if (type === "file" && id === "aadhaar_card") {
      // For Aadhaar Card file input
      const file = e.target.files[0];
      setAadhaarCard(file); // Set the file directly to the state
    } else if (type === "file" && id === "pan") {
      // For PAN Card file input
      const file = e.target.files[0];
      setPanCard(file); // Set the file directly to the state
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
        worker: {
          ...prevData.worker,
          [id]: value,
        },
      }));
    }
  };

  const handleUpdateUser = () => {
    const formDataToSend = new FormData();
    
    // Iterate over each field in formData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "user_documents") {
        // Assuming value is an array of documents
        value.forEach((document) => {
          // Check if document is in binary format, if not, convert it
          // Append each document to formDataToSend
          formDataToSend.append("user_documents", document);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    // Append all images to formDataToSend
    allImages.forEach((image) => {
      // Check if image is in binary format, if not, convert it
      formDataToSend.append("user_images", image);
    });
  
    // Check other sources of images (confirmedUploadedImages, confirmedCapturedImages) and append them if needed
  
    // Append additional documents (aadhaarCard, panCard) if available
    if (aadhaarCard) {
      formDataToSend.append("aadhaar_card", aadhaarCard);
    }
    if (panCard) {
      formDataToSend.append("pan", panCard);
    }
  
    dispatch(showLoading());
    axios
      .put(`/accounts/contract-workers/update/${id}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Contract Worker updated successfully:", response.data);
        toast.success("Contract Worker updated successfully");
        history.push("/contract-workers");
        dispatch(hideLoading());
      })
      .catch((error) => {
        console.error("Error updating contract worker:", error);
        toast.error("Error updating Contract Worker");
        dispatch(hideLoading());
      });
  };
  
  // const handleUpdateUser = () => {
  //   const formDataToSend = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     formDataToSend.append(key, value);
  //   });

  //   uploadedImages.forEach((image) => {
  //     formDataToSend.append("user_images", image);
  //   });

  //   if (aadhaarCard) {
  //     formDataToSend.append("aadhaar_card", aadhaarCard);
  //   }

  //   if (panCard) {
  //     formDataToSend.append("pan", panCard);
  //   }

  //   dispatch(showLoading());
  //   axios
  //     .put(`/accounts/contract-workers/update/${id}/`, formDataToSend, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       console.log("Contract Worker updated successfully:", response.data);
  //       toast.success("Contract Worker updated successfully");
  //       history.push("/contract-workers");
  //       dispatch(hideLoading());
  //     })
  //     .catch((error) => {
  //       console.error("Error updating contract worker:", error);
  //       toast.error("Error updating Contract Worker");
  //       dispatch(hideLoading());
  //     });
  // };

  const handleAddImage = () => {
    if (uploadedImages.length > 0) {
      setConfirmedUploadedImages([
        ...confirmedUploadedImages,
        ...uploadedImages,
      ]);
      setUploadedImages([]);
    }
    if (capturedImages.length > 0) {
      setConfirmedCapturedImages([
        ...confirmedCapturedImages,
        ...capturedImages,
      ]);
      setCapturedImages([]);
    }
  };

  const handleDeleteImage = (index) => {
    console.log("Deleting image at index:", index);
    const updatedImages = [...allImages];
    updatedImages.splice(index, 1);
    setAllImages(updatedImages);
  };

  const handleEyeButtonClick = (type) => {
    if (type === "aadhaar_card") {
      setShowAadhaarCard(true);
    } else if (type === "pan") {
      setShowPanCard(true);
    }
  };

  const handleClearAadhaarCard = () => {
    setShowAadhaarCard(false);
    setFormData((prevData) => ({
      ...prevData,
      worker: {
        ...prevData.worker,
        aadhaar_card: "",
      },
    }));
  };

  const handleClearPanCard = () => {
    setShowPanCard(false);
    setFormData((prevData) => ({
      ...prevData,
      worker: {
        ...prevData.worker,
        pan: "",
      },
    }));
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
                <h2 className="mb-0">Edit Contract Worker</h2>
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
                      <i className="fas fa-user-plus"></i> Edit Worker
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button className="btn btn-primary" onClick={handleUpdateUser}>
                <i className="fas fa-save"></i> Save Worker
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
                        value={formData.worker.first_name}
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
                        value={formData.worker.last_name}
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
                        value={formData.worker.email}
                        onChange={handleChange}
                      />
                    </div>
                    {/* <div className="col-md-6">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div> */}
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
                        value={formData.worker.emp_id}
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
                        value={formData.worker.phone_number}
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
                          value={formData.worker.agency.id}
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
                        value={formData.worker.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-2">
                    <div className="row g-3">
                      {allImages.map((document, index) => (
                        <div className="col-md-2" key={index}>
                          <div className="card position-relative">
                            {document && document.document_url && (
                              <img
                                src={document.document_url}
                                className="card-img-top"
                                alt="Document"
                                style={{ height: "200px", objectFit: "cover" }}
                              />
                            )}
                            {document && document instanceof File && (
                              <img
                                src={URL.createObjectURL(document)}
                                className="card-img-top"
                                alt={`Uploaded Image ${index}`}
                                style={{ height: "200px", objectFit: "cover" }}
                              />
                            )}
                            <button
                              className="btn btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle"
                              onClick={() => handleDeleteImage(index)}
                              style={{ zIndex: 1 }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#imageModal"
                      >
                        <i className="fas fa-plus"> New Images</i>
                      </button>
                    </div>
                    <div
                      className="modal fade"
                      id="imageModal"
                      tabIndex="-1"
                      aria-labelledby="imageModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Add New Image</h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div
                            className="modal-body"
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
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
                                    style={{
                                      marginLeft: "5px",
                                      fontWeight: "normal",
                                    }}
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
                                    style={{
                                      marginLeft: "5px",
                                      fontWeight: "normal",
                                    }}
                                  >
                                    Capture Photo from Webcam
                                  </label>
                                </div>
                              </div>
                            </div>

                            {imageOption === "upload" ? (
                              <div className="col-md-8">
                                <label
                                  htmlFor="user_images"
                                  className="form-label"
                                >
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
                                </button>
                                {capturedImages &&
                                  capturedImages.length > 0 && (
                                    <div className="row g-3">
                                      {capturedImages.map((image, index) => (
                                        <div
                                          className="col-md-auto"
                                          key={index}
                                        >
                                          <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Uploaded Image ${index}`}
                                            className="img-thumbnail"
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "100%",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() => handleAddImage()}
                              data-bs-dismiss="modal"
                            >
                              Add Image
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-6">
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
                    </div> */}
                    {/* {imageOption === "upload" ? (
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
                        </button>
                      </div>
                    )} */}
                    <div className="row g-3 mb-2">
                      <div className="row g-3 mb-2">
                        <div className="col-md-6">
                          <label
                            htmlFor="aadhaar_card"
                            className="form-label"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            Aadhaar Card:
                            <div
                              style={{
                                marginLeft: "5px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <a
                                className="btn btn-outline-primary rounded-circle"
                                href={formData.worker.aadhaar_card}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  handleEyeButtonClick("aadhaar_card")
                                }
                                style={{
                                  fontWeight: "normal",
                                  marginRight: "5px", // Add margin between button and text
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                              <p style={{ marginBottom: "0" }}>
                                {formData.worker.aadhaar_card ? (
                                  <p
                                    style={{
                                      marginBottom: "0",
                                      marginLeft: "3%",
                                    }}
                                  >
                                    {formData.worker.aadhaar_card
                                      .split("/")
                                      .pop()}
                                  </p>
                                ) : (
                                  <p
                                    style={{
                                      marginBottom: "0",
                                      marginLeft: "3%",
                                    }}
                                  >
                                    Aadhaar Card Not Uploaded
                                  </p>
                                )}
                              </p>
                            </div>
                          </label>

                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              id="aadhaar_card"
                              onChange={handleChange}
                            />
                          </div>
                          {/* Clear checkbox for Aadhaar Card */}
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="clearAadhaarCard"
                              onChange={handleClearAadhaarCard}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="clearAadhaarCard"
                            >
                              Clear Aadhaar Card
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label
                            htmlFor="pan"
                            className="form-label"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            PAN Card :
                            <div
                              style={{
                                marginLeft: "5px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <a
                                href={formData.worker.pan}
                                className="btn btn-outline-primary rounded-circle"
                                style={{
                                  marginLeft: "5px",
                                  fontWeight: "normal",
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleEyeButtonClick("pan")}
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                              <p
                                style={{ marginBottom: "0", marginLeft: "3%" }}
                              >
                                {formData.worker.pan ? (
                                  <p>
                                    {formData.worker.pan.split("/").pop()}
                                  </p>
                                ) : (
                                  <p
                                   
                                  >
                                    Pan Card Not Uploaded
                                  </p>
                                )}
                              </p>
                            </div>
                          </label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control"
                              id="pan"
                              onChange={handleChange}
                            />
                          </div>
                          {/* Clear checkbox for PAN Card */}
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="clearPanCard"
                              onChange={handleClearPanCard}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="clearPanCard"
                            >
                              Clear PAN Card
                            </label>
                          </div>
                        </div>
                      </div>
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
            aria-labelledby="imageModalLabel"
            aria-hidden="true"
            ref={modalRef}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="imageModalLabel">
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

                  <button
                    className="btn btn-primary "
                    onClick={handleSavePhoto}
                    data-bs-dismiss="modal"
                  >
                    Save Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EditContractWorker;
