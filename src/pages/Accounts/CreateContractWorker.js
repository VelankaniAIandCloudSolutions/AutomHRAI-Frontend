import React, { useState, useEffect } from "react";
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
    user_image: "",
    aadhaar_card: null,
    pan: null,
    dob: "",
    company: "",
    agency: "",
  });
  const [agencies, setAgencies] = useState([]);
  const history = useHistory();
  const [requiredFields, setRequiredFields] = useState([
    "first_name",
    "email",
    "password",
  ]);

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

  // const handleChange = (e) => {
  //   const { id, value, type } = e.target;

  //   // If the input is a file input and it's for user images, get the file object(s)
  //   let files = null;
  //   if (type === "file" && id === "user_images") {
  //     files = Array.from(e.target.files);
  //   } else {
  //     // If the input is a file input for Aadhaar card or PAN card, get only the first file
  //     files = type === "file" ? e.target.files[0] : null;
  //   }

  //   // Update the form data state based on the input type
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: type === "file" ? files : value,
  //   }));
  // };
  const handleChange = (e) => {
    const { id, type } = e.target;
    let value = e.target.value;

    // If the input is a file input and it's for user images, get the file object(s)
    let files = null;
    if (type === "file" && id === "user_images") {
      files = Array.from(e.target.files);
      // Set value to the array of file names for display purposes, if needed
      value = files.map((file) => file.name).join(", ");
    } else {
      // If the input is a file input for Aadhaar card or PAN card, get only the first file
      files = type === "file" ? e.target.files[0] : null;
      // Set value to the file name for display purposes, if needed
      value = files ? files.name : value;
    }

    // Update the form data state based on the input type
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "file" ? files : value,
    }));
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
    console.log("form data", formDataToSend);
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ", " + pair[1]);
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
        // You can redirect to another page or perform other actions here
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
                      />
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
