import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios, { all } from "axios";

import "../FaceRecognition/checkintest.css";

import { useHistory } from "react-router-dom";
import { Modal } from "bootstrap";
import { type } from "@testing-library/user-event/dist/type";

import { toast } from "react-toastify";

function CheckInCheckOut() {
  const [videoStream, setVideoStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  const [checkinData, setCheckinData] = useState([]);
  const [timesheetData, setTimeSheetData] = useState([]);

  const [latestEntryType, setLatestEntryType] = useState("");

  const [workingTime, setWorkingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const history = useHistory();

  const loggedUser = JSON.parse(localStorage.getItem("userAccount"));
  const id = loggedUser.user_account.id;

  const fetchCheckinData = async () => {
    try {
      const response = await axios.get(
        `/facial-recognition/get_checkin_data/${id}`
      );

      const { checkin_data, break_data, timesheet_data } = response.data;

      console.log("the time sheet data", timesheet_data);

      // Combine checkin_data and break_data to get all types of entries
      const allEntries = [...checkin_data, ...break_data];

      // Sort the combined entries based on the created_at timestamp
      allEntries.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      console.log("the all data", allEntries);

      // Define the latest entry type as null initially
      let latestEntryType = null;

      // Iterate through allEntries to find the latest entry type
      for (let i = allEntries.length - 1; i >= 0; i--) {
        const entry = allEntries[i];
        if (entry.type === "checkin") {
          latestEntryType = "checkin";
          break;
        } else if (entry.type === "checkout") {
          latestEntryType = "checkout";
          break;
        } else if (entry.type === "breakin") {
          latestEntryType = "breakin";
          break;
        } else if (entry.type === "breakout") {
          latestEntryType = "breakout";
          break;
        }
      }

      console.log("Latest entry type:", latestEntryType);

      setCheckinData(checkin_data);
      setTimeSheetData(response.data.timesheet_data);
      setLatestEntryType(latestEntryType);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching check-in data");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCheckinData();
  }, []);

  const formatBreakTime = (breakTime) => {
    if (!breakTime) return "N/A";

    // Parse ISO 8601 duration format (e.g., "P0DT00H14M51.889825S")
    const match = breakTime.match(/T(\d+)H(\d+)M/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return `${hours} Hrs ${minutes} Mins`;
    }
    return "N/A";
  };

  useEffect(() => {
    console.log("Latest entry type:", latestEntryType);
    const storedStartTime = localStorage.getItem("startTime");
    const storedBreakInTime = localStorage.getItem("BreakInTime");
    const storedCheckInTime = localStorage.getItem("CheckInTime");

    if (latestEntryType === "checkin" && !storedStartTime) {
      // Start the stopwatch and store the start time when the latest entry type is 'checkin' and there is no stored start time
      console.log("Starting stopwatch...");
      const startTime = Date.now();
      localStorage.setItem("startTime", startTime.toString());
      localStorage.setItem("CheckInTime", startTime.toString());

      // Start the stopwatch
      const id = setInterval(() => {
        setWorkingTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(id);
    } else if (latestEntryType === "checkout") {
      // Stop the stopwatch
      clearInterval(timerId);
      // Clear the stored start time from localStorage when the user checks out
      localStorage.removeItem("startTime");
      localStorage.removeItem("CheckInTime");
    } else if (latestEntryType === "breakin" && !storedBreakInTime) {
      // Store break in time in localStorage when the user breaks in and there is no stored break in time
      localStorage.setItem("BreakInTime", Date.now().toString());
    } else if (
      (latestEntryType === "breakin" || latestEntryType === "breakout") &&
      storedBreakInTime
    ) {
      // Calculate the elapsed time since the break in time stored in localStorage
      console.log("Resuming stopwatch...");
      const breakInTime = parseInt(storedBreakInTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - breakInTime) / 1000);

      // Update the working time with the elapsed time
      setWorkingTime(elapsedTime);
      const id = setInterval(() => {
        setWorkingTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(id);
    } else if (latestEntryType === "checkin" && storedStartTime) {
      // Calculate the elapsed time since the start time stored in localStorage
      console.log("Resuming stopwatch...");
      const startTime = parseInt(storedStartTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);

      // Start the stopwatch with the elapsed time
      setWorkingTime(elapsedTime);
      const id = setInterval(() => {
        setWorkingTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(id);
    } else if (latestEntryType === "breakout" && storedCheckInTime) {
      // Calculate the elapsed time since the check-in time stored in localStorage
      console.log("Resuming stopwatch...");
      const checkInTime = parseInt(storedCheckInTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - checkInTime) / 1000);

      // Start the stopwatch with the elapsed time
      setWorkingTime(elapsedTime);
      const id = setInterval(() => {
        setWorkingTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(id);
    }
  }, [latestEntryType]);

  const renderCheckinTime = (checkinData, timesheetData) => {
    let checkinTime = null;
    let checkoutTime = null;

    // Extract check-in and check-out times from checkinData
    checkinData.forEach((entry) => {
      if (entry.type === "checkin") {
        checkinTime = new Date(entry.created_at);
      } else if (entry.type === "checkout") {
        checkoutTime = new Date(entry.created_at);
      }
    });

    // Extracting working_time from timesheetData
    const workingTime =
      timesheetData.length > 0 ? timesheetData[0].working_time : null;

    // Format working time as needed
    let totalHours = 0;
    let totalMinutes = 0;

    if (workingTime) {
      // Parse ISO 8601 duration format (e.g., "P0DT00H07M14.714855S")
      const match = workingTime.match(/T(\d+)H(\d+)M/);
      if (match) {
        totalHours = parseInt(match[1], 10);
        totalMinutes = parseInt(match[2], 10);
      }
    }

    return { checkinTime, checkoutTime, totalHours, totalMinutes };
  };

  const { checkinTime, checkoutTime, totalHours, totalMinutes } =
    renderCheckinTime(checkinData, timesheetData);
  renderCheckinTime(checkinData, timesheetData);

  const handleCapture = (type) => {
    if (!videoStream) return;

    setIsLoading(true);

    const currentTime = new Date().toLocaleString();

    setTimeout(() => {
      const track = videoStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      imageCapture
        .takePhoto()
        .then((blob) => {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          img.className = "captured-image";
          imageRef.current.innerHTML = "";
          imageRef.current.appendChild(img);

          videoRef.current.classList.add("not-visible");

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;

            const fd = new FormData();
            fd.append("photo", base64data);
            fd.append("checkin_time", currentTime);
            fd.append("type", type);
            fd.append("user_id", id);

            axios
              .post("facial-recognition/mark_attendance_without_login/", fd)
              .then((resp) => {
                console.log(resp.data);
                setIsLoading(false);
                if (resp.data.message) {
                  toast.success(resp.data.message);
                  setLatestEntryType(
                    type === "checkin" ? "checkout" : "checkin"
                  );
                  setTimeout(() => {
                    closeModal();
                    window.location.reload();
                  }, 3500);
                } else {
                  toast.error(resp.data.error || "Failed to detect user");
                }
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false);
                toast.error("Failed to detect user");
              });
          };
        })
        .catch((error) => {
          console.log("takePhoto() error: ", error);
          setIsLoading(false);
          setFailureMessage("Failed to capture photo");
        });
    }, 2000);
  };

  const handleBreaks = (type) => {
    if (!videoStream) return;

    setIsLoading(true);

    const currentTime = new Date().toLocaleDateString();

    setTimeout(() => {
      const track = videoStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);

      imageCapture
        .takePhoto()
        .then((blob) => {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          img.className = "captured-image";
          imageRef.current.innerHTML = "";
          imageRef.current.appendChild(img);

          videoRef.current.classList.add("not-visible");

          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;

            const fd = new FormData();
            fd.append("photo", base64data);
            fd.append("checkin_time", currentTime);
            fd.append("type", type);
            fd.append("user_id", id);

            console.log("break in user id", id);

            axios
              .post("facial-recognition/break_in_out/", fd)
              .then((resp) => {
                console.log(resp.data);
                setIsLoading(false);
                if (resp.data.message) {
                  toast.success(resp.data.message);
                  // Handle successful break
                  if (type === "breakin") {
                    localStorage.setItem("BreakInTime", Date.now());
                  } else if (type === "breakout") {
                    const breakInTime = localStorage.getItem("BreakInTime");
                    if (breakInTime) {
                      const elapsedBreakTime = Math.floor(
                        (Date.now() - parseInt(breakInTime)) / 1000
                      );
                      setWorkingTime((prevTime) => prevTime + elapsedBreakTime);
                    }
                    localStorage.removeItem("BreakInTime");
                  }
                } else {
                  toast.error(resp.data.error || "Failed to detect user");
                }
                setLatestEntryType(type === "breakin" ? "breakout" : "breakin");
                setTimeout(() => {
                  closeModal();
                  window.location.reload();
                }, 3500);
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false);
                toast.error("Failed to detect user");
              });
          };
        })
        .catch((error) => {
          console.log("takePhoto() error :", error);
          setIsLoading(false);
          setFailureMessage("Failed to capture photo");
        });
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

  const formatWithLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  // Helper function to format time with spaces between hours and minutes
  const formatTimeWithSpaces = (hours, minutes) => {
    const formattedHours = formatWithLeadingZero(hours);
    const formattedMinutes = formatWithLeadingZero(minutes);
    return `${formattedHours} : ${formattedMinutes}`;
  };

  useEffect(() => {
    setupCamera();
  }, []);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      new Modal(modal);
    }
  }, []);

  return (
    <div className="container">
      <div className="card mx-auto" style={{ width: "100%" }}>
        <h5 className="card-header">Attendance</h5>
        <div className="card-body text-center">
          {latestEntryType === "breakin" && <h3>Break Time</h3>}
          {latestEntryType === "breakout" && <h3>Check In Time</h3>}

          <div className="d-flex align-items-center justify-content-center">
            <div
              className="bg-light p-2 mt-4"
              style={{
                borderRadius: "50%",
                width: "150px",
                height: "150px",
                border: "5px solid #e3e3e3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h5>
                {latestEntryType === "checkin" ||
                latestEntryType === "breakin" ||
                latestEntryType === "breakout" ? (
                  <h4>
                    {formatTimeWithSpaces(
                      Math.floor(workingTime / 3600),
                      Math.floor((workingTime % 3600) / 60)
                    )}
                  </h4>
                ) : (
                  `${totalHours} Hrs : ${totalMinutes} Mins`
                )}
              </h5>
            </div>
          </div>
          <br></br>

          <div className="mt-3 text-center">
            <p>
              {" "}
              Check-In At :{" "}
              {checkinTime ? checkinTime.toLocaleTimeString() : "N/A"}
            </p>
            <p>
              {" "}
              Check-Out At :{" "}
              {checkoutTime ? checkoutTime.toLocaleTimeString() : "N/A"}
            </p>

            {(latestEntryType === "checkin" ||
              latestEntryType === "checkout") && (
              <p>
                {" "}
                Total Break Time :{" "}
                {formatBreakTime(timesheetData[0]?.break_time)}
              </p>
            )}
          </div>

          <div className="mt-5 mb-5">
            {latestEntryType === "checkin" && (
              <>
                <button
                  className="btn btn-primary mx-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("checkout")}
                >
                  <i className="fas fa-user-clock"></i> Check Out
                </button>
                <button
                  className="btn btn-primary mx-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleBreaks("breakin")}
                >
                  <i className="fas fa-coffee"></i> Break In
                </button>
              </>
            )}
            {latestEntryType === "breakin" && (
              <button
                className="btn btn-primary mx-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => handleBreaks("breakout")}
              >
                <i className="fas fa-coffee"></i> Break Out
              </button>
            )}
            {latestEntryType === "breakout" && (
              <>
                <button
                  className="btn btn-primary mx-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleCapture("checkout")}
                >
                  <i className="fas fa-user-clock"></i> Check Out
                </button>
                <button
                  className="btn btn-primary mx-2"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleBreaks("breakin")}
                >
                  <i className="fas fa-coffee"></i> Break In
                </button>
              </>
            )}
            {/* When no data is available or the latest entry type is check out, display the Check In button */}
            {(!latestEntryType || latestEntryType === "checkout") && (
              <button
                className="btn btn-primary mx-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => handleCapture("checkin")}
              >
                <i className="fas fa-user-check"></i> Check In
              </button>
            )}
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
                Attendance
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
              {isLoading && <div className="text-center mt-3">Loading...</div>}
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
              {failureMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {failureMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-info"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInCheckOut;
