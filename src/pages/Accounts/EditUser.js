import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LoadingScreen from "../../components/Layout/LoadingScreen";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../actions/loadingActions";

function EditUser() {
  // const userId=data.params.id;
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    emp_id: "",
    phoneNumber: "",
    user_image: "",
    is_active: true,
    is_superuser: false,
    is_staff: false,
    is_supervisor: false,
    is_supervisor_admin: false,

    // Add other fields as needed
  });
  const [initialImage, setInitialImage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [ImageLabel, setImageLabel] = useState("");
  const [clearImage, setClearImage] = useState(false);
  const history = useHistory();
  const handleEditUser = async () => {
    if (clearImage) {
      // Set user_image to null only if clearImage is true
      setUserData((prevData) => ({
        ...prevData,
        user_image: null,
        preview: null, // Also set preview to null to prevent displaying the old image
      }));
    }

    const formDataToSend = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    dispatch(showLoading());
    axios
      .put(`/accounts/users/update/${id}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Handle successful response
        console.log("User edited successfully:", response.data);
        toast.warn("User updated successfully");
        history.push("/users");
        dispatch(hideLoading());
        // You can redirect to another page or perform other actions here
      })
      .catch((error) => {
        // Handle error
        console.error("Error editing user:", error);
        // toast.error('Error occured. Please try again.');
        dispatch(hideLoading());
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get(`/accounts/users/${id}`);
        console.log(response.data); // Logging the whole user data response

        setUserData(response.data.user);
        // Assuming response.data.user contains `emp_id` and `user_image` properties
        setCurrentImage(response.data.user.user_image); // Set initial image URL

        const imageName = response.data.user.user_image.split("/").pop(); // Extracting image name from URL
        console.log(imageName); // Logging the image name
        setImageLabel(imageName); // Setting the image label state
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchUserData();
  }, [id, dispatch]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserData((prevData) => ({
      ...prevData,
      user_image: file,
      preview: URL.createObjectURL(file),
    }));
  };
  const handleClearImage = (e) => {
    setClearImage(e.target.checked);
    if (e.target.checked) {
      setUserData((prevData) => ({
        ...prevData,
        user_image: null,
        preview: null,
      }));
    }
    setCurrentImage("");
    // setInitialImage('');
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
                <h2 className="mb-0">Users</h2>

                <span className="ms-3 fs-4 text-muted">|</span>

                <nav aria-label="breadcrumb" className="mt-3">
                  <ol className="breadcrumb bg-transparent">
                    <li className="breadcrumb-item">
                      <a href="/">
                        {" "}
                        <i className="fas fa-home"></i> Home
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="/users/">
                        {" "}
                        <i className="fas fa-users"></i> Users
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <i className="fas fa-pen"> </i> Update User
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
            <div className="col-md-3 d-flex justify-content-end mt-4">
              <button className="btn btn-primary" onClick={handleEditUser}>
                <i className="fas fa-pen"> </i> Update User
              </button>
            </div>
          </div>

          <div className="card-container mt-4">
            <div className="card">
              <h5 className="card-header">User Information</h5>
              <div className="card-body">
                <div className="form-container">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="first_name" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        value={userData.first_name}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            first_name: e.target.value,
                          })
                        }
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
                        value={userData.last_name}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            last_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                      />
                    </div>
                    {/* <div className="col-md-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={userData.password} 
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}/>
                  </div> */}
                    <div className="col-md-6">
                      <label htmlFor="phone_number" className="form-label">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone_number"
                        value={userData.phone_number}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="emp_id" className="form-label">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="emp_id"
                        value={userData.emp_id}
                        onChange={(e) =>
                          setUserData({ ...userData, emp_id: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-2 ml-3">
                      <div className="form-check form-switch mt-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_active"
                          checked={userData.is_active}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label" htmlFor="is_active">
                          Is Active
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_superuser"
                          checked={userData.is_superuser}
                          onChange={(e) => {
                            const is_superuser = e.target.checked;
                            setUserData({
                              ...userData,
                              is_superuser,
                              is_staff: is_superuser ? true : userData.is_staff, // Set is_staff to true if is_superuser is checked
                            });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_superuser"
                        >
                          Is Admin
                        </label>
                      </div>
                      <div className="form-check form-switch ">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_supervisor_admin"
                          checked={userData.is_supervisor_admin}
                          onChange={(e) => {
                            const is_supervisor_admin = e.target.checked;
                            setUserData({
                              ...userData,
                              is_supervisor_admin,
                              is_supervisor: is_supervisor_admin
                                ? true
                                : userData.is_supervisor, // Set is_staff to true if is_supervisor is checked
                            });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_supervisor_admin"
                        >
                          Is Supervisor Admin
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check form-switch mt-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_staff"
                          checked={userData.is_staff}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              is_staff: e.target.checked,
                            })
                          }
                        />
                        <label className="form-check-label" htmlFor="is_staff">
                          Is Staff
                        </label>
                      </div>
                      <div className="form-check form-switch ">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_supervisor"
                          checked={userData.is_supervisor}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              is_supervisor: e.target.checked,
                            });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_supervisor"
                        >
                          Is Supervisor
                        </label>
                      </div>
                    </div>

                    <div className="row g-3">
                      {userData.user_image && (
                        <div className="col-md-3">
                          <label htmlFor="user_image" className="form-label">
                            {ImageLabel}
                          </label>
                          <br />
                          <img
                            src={currentImage}
                            alt="User Preview"
                            style={{
                              marginTop: "10px",
                              maxWidth: "100%",
                              height: "50%",
                            }}
                          />
                          <br />

                          <input
                            className="form-check-input ml-0"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            onChange={handleClearImage}
                          />
                          <label
                            className="form-check-label ml-4"
                            htmlFor="flexCheckDefault"
                          >
                            Clear Image
                          </label>
                        </div>
                      )}

                      <div className="col-md-3">
                        {/* {clearImage ? null : (
                      <> */}
                        <label htmlFor="user_image" className="form-label">
                          Image Upload
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          id="user_image"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {/* </>
                    )} */}
                      </div>
                      <div className="col-md-6">
                        {clearImage ? null : (
                          <>
                            {userData.preview && (
                              <img
                                src={userData.preview}
                                alt="User Preview"
                                style={{
                                  marginTop: "10px",
                                  maxWidth: "100%",
                                  height: "50%",
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
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

export default EditUser;
