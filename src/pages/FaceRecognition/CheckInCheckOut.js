import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

import '../FaceRecognition/checkintest.css'

import { useHistory } from 'react-router-dom';
import { Modal } from 'bootstrap';

function CheckInCheckOut() {
  const [videoStream, setVideoStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  const [checkinData, setCheckinData] = useState([]);
  const [timesheetData , setTimeSheetData] = useState([]);

  const [latestEntryType, setLatestEntryType] = useState('');

  const [workingTime, setWorkingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const fetchCheckinData = async () => {
      console.log("Hii");
      try {
        const userId = 2;
        const response = await axios.get(`/facial-recognition/get_checkin_data/${userId}`);

        const { checkin_data , timesheet_data } = response.data;
        
        setCheckinData(checkin_data);
        setTimeSheetData(timesheet_data)

        console.log("the checks details", response.data)


        const latestEntryType = checkin_data.length >= 0 ? checkin_data[checkin_data.length - 1].type : null;
       console.log(checkin_data)
        console.log(`Latest Entry Type Log======${latestEntryType}`);
        setLatestEntryType(latestEntryType);

        setIsLoading(false);
      } catch (error) {
        setError('Error fetching check-in data');
        setIsLoading(false);
      }
    }

    fetchCheckinData();
  }, []);

  useEffect(() => {
    console.log("Latest entry type:", latestEntryType);
    const storedStartTime = localStorage.getItem('startTime');
    console.log("Stored start time:", storedStartTime);
    if (latestEntryType === 'checkin' && !storedStartTime) {
      // Start the stopwatch and store the start time when the latest entry type is 'checkin' and there is no stored start time
      console.log("Starting stopwatch...");
      const startTime = Date.now();
      localStorage.setItem('startTime', startTime.toString());
  
      // Start the stopwatch
      const id = setInterval(() => {
        setWorkingTime(prevTime => prevTime + 1);
      }, 1000);
      setTimerId(id);
    } else if (latestEntryType === 'checkout') {
      // Stop the stopwatch
      clearInterval(timerId);
      // Clear the stored start time from localStorage when the user checks out
      localStorage.removeItem('startTime');
    } else if (latestEntryType === 'checkin' && storedStartTime) {
      // Calculate the elapsed time since the start time stored in localStorage
      console.log("Resuming stopwatch...");
      const startTime = parseInt(storedStartTime, 10);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  
      // Start the stopwatch with the elapsed time
      setWorkingTime(elapsedTime);
      const id = setInterval(() => {
        setWorkingTime(prevTime => prevTime + 1);
      }, 1000);
      setTimerId(id);
    }
  }, [latestEntryType]);
  
  



  // useEffect(() => {
  //   const storedStartTime = localStorage.getItem('startTime');
  //   if (latestEntryType === 'checkin' && storedStartTime) {
  //     // Calculate the elapsed time since the start time stored in localStorage
  //     const startTime = parseInt(storedStartTime, 10);
  //     const currentTime = Date.now();
  //     const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  
  //     // Start the stopwatch with the elapsed time
  //     setWorkingTime(elapsedTime);
  //     const id = setInterval(() => {
  //       setWorkingTime(prevTime => prevTime + 1);
  //     }, 1000);
  //     setTimerId(id);
  //   } else if (latestEntryType === 'checkout') {
  //     // Stop the stopwatch
  //     clearInterval(timerId);
  //   }
  // }, [latestEntryType]);
  

  const renderCheckinTime = () => {
    let checkinTime = null;
    let checkoutTime = null;
  
    // Extract check-in and check-out times from checkinData
    checkinData.forEach(entry => {
      if (entry.type === "checkin") {
        checkinTime = new Date(entry.created_at);
      } else if (entry.type === "checkout") {
        checkoutTime = new Date(entry.created_at);
      }
    });

    // Calculate total working time based on check-in and check-out times
    let totalWorkingTime = 0;
    if (checkinTime && checkoutTime) {
      totalWorkingTime = (checkoutTime - checkinTime) / (1000 * 60 * 60); // Convert milliseconds to hours
    }

    // Convert total working time to hours and minutes
    const totalHours = Math.floor(totalWorkingTime);
    const totalMinutes = Math.round((totalWorkingTime - totalHours) * 60);

    return { checkinTime, checkoutTime, totalHours, totalMinutes };
  };

  const { checkinTime, checkoutTime, totalHours, totalMinutes } = renderCheckinTime();
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
  
            axios.post("facial-recognition/upload_photo/", fd)
              .then((resp) => {
                console.log(resp.data);
                setIsLoading(false);
                setSuccessMessage('User detected successfully');
                setLatestEntryType(type === 'checkin' ? 'checkout' : 'checkin');
                setTimeout(() => {
                  closeModal();
                  window.location.reload();
                }, 3500);
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false);
                setFailureMessage('Failed to detect user');
              });
          };
        })
        .catch((error) => {
          console.log("takePhoto() error: ", error);
          setIsLoading(false);
          setFailureMessage('Failed to capture photo');
        });
    }, 2000);
  };

  const closeModal = () => {
    const modal = modalRef.current;
    if (modal) {
      const bsModal = Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
        const backdrops = document.querySelectorAll('.modal-backdrop fade show');
        backdrops.forEach(backdrop => {
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

  useEffect(() => {
    setupCamera();
  }, []);

  // useEffect(() => {
  //   const latestEntryType = checkinData.length > 0 ? checkinData[0].type : null;
  //   setLatestEntryType(latestEntryType);
  // }, [checkinData]);

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


          <div className="d-flex align-items-center justify-content-center">
            {/* <div className="bg-light p-2 mt-4" style={{ borderRadius: "50%", width: "150px", height: "150px", border: "5px solid #e3e3e3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h4>{checkinTime ? checkinTime.toLocaleTimeString() : 'N/A'}</h4>
              <p>Check In</p>
            </div> */}

            <div className="bg-light p-2 mt-4" style={{ borderRadius: "50%", width: "150px", height: "150px", border: "5px solid #e3e3e3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h4>{latestEntryType === 'checkin' ? `${Math.floor(workingTime / 3600)} : ${Math.floor((workingTime % 3600) / 60)} : ${workingTime % 60}` : `${totalHours} : ${totalMinutes} Hrs`}</h4>
            </div>
           

            {/* <div className="bg-light p-2 mt-4" style={{ borderRadius: "50%", width: "150px", height: "150px", border: "5px solid #e3e3e3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <h4>{checkoutTime ? checkoutTime.toLocaleTimeString() : 'N/A'}</h4>
              <p>Check Out</p>
            </div> */}
          </div>
          {/* Render total working time */}
          {latestEntryType === 'checkin' && (
            <div className="mt-3 text-center">
              <p> Check-In At : { checkinTime ? checkinTime.toLocaleTimeString() : 'N/A'}</p>
              <p> Check-Out At : {checkoutTime ? checkoutTime.toLocaleTimeString() : 'N/A'}</p>
              {/* <h4>Total Working Time: {totalHours} Hrs {totalMinutes} Mins</h4> */}
            </div>
          )}
          
          <div className="mt-5 mb-5">
          {latestEntryType === "checkin" ? (
            <button
                className="btn btn-primary mx-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => handleCapture("checkout")}
            >
                <i className="fas fa-user-clock"></i> Check Out
            </button>
            ) : (
            <button
                type="button"
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

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"  ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Attendance</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="text-center">
                <video autoPlay={true} id="video-element" ref={videoRef} style={{width: 320, height: 240}}></video>
              </div>
              
              <div id="img-element" ref={imageRef}></div>
              {isLoading && <div className="text-center mt-3">Loading...</div>}
              {successMessage && <div className="alert alert-success mt-3" role="alert">{successMessage}</div>}
              {failureMessage && <div className="alert alert-danger mt-3" role="alert">{failureMessage}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-info" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckInCheckOut;















// const webcamRef = useRef(null);
//   const [imageSrc, setImageSrc] = useState(null);
//   const [showWebcamModal, setshowWebcamModal] = useState(false);
//   const handleClose = () => {
//     setshowWebcamModal(false);
//   };

//   const capture = () => {
//     // const imageSrc = webcamRef.current.getScreenshot();
//     // setImageSrc(imageSrc);
//   };

//   const handleCheckIn = () => {
//     // Implement your check-in logic here
//     console.log("Checked In");
//     setshowWebcamModal(true);
//   };

//   const handleCheckOut = () => {
//     // Implement your check-out logic here
//     console.log("Checked Out");
//     setshowWebcamModal(true);
//   };

//   return (
//     <div className="container">
//       <div className="row align-items-center">
//         <div className="col-md-9 mt-4">
//           <div className="d-flex align-items-center">
//             <h2 className="mb-0">Attendance</h2>

//             <span className="mx-3">|</span>

//             <nav aria-label="breadcrumb" className="mt-3">
//               <ol className="breadcrumb">
//                 <li className="breadcrumb-item">
//                   <a href="/">
//                     {" "}
//                     <i className="fas fa-home"></i> Home
//                   </a>
//                 </li>
//                 <li className="breadcrumb-item active" aria-current="page">
//                   <i className="fas fa-list"> </i> Attendance
//                 </li>
//               </ol>
//             </nav>
//           </div>
//         </div>
//       </div>
//       <div
//         className="card-container mt-4 mx-auto"
//         style={{ maxWidth: "400px" }}
//       >
//         <div className="card mx-auto" style={{ width: "100%" }}>
//           <h5 className="card-header">Attendance</h5>
//           <div className="card-body text-center">
//             {/* <div className="blank-container"></div> */}
//             {/* <div className="bg-light p-2"></div> */}
//             <div className="d-flex align-items-center justify-content-center">
//               <div
//                 className="bg-light p-2 mt-4"
//                 style={{
//                   borderRadius: "50%",
//                   width: "150px",
//                   height: "150px",
//                   border: "5px solid #e3e3e3",
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <h4>0.0 Hrs</h4>
//               </div>
//             </div>

//             {/* <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 className="webcam"
//                 videoConstraints={{ width: 320, height: 240 }}
//               /> */}
//             <div className="mt-5 mb-5">
//               {/* <button className="btn btn-primary mx-2" onClick={capture}>Capture</button> */}
//               <button className="btn btn-primary mx-2" onClick={handleCheckIn}>
//                 <i className="fas fa-user-check"></i> Check In
//               </button>
//               <button className="btn btn-primary mx-2" onClick={handleCheckOut}>
//                 <i className="fas fa-user-clock"></i> Check Out
//               </button>
//             </div>
//             {imageSrc && (
//               <div className="mt-3">
//                 <img src={imageSrc} alt="Captured" className="captured-image" />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* <Modal show={showWebcamModal} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Attendance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           className="text-center"
//           style={{ height: "300px", overflow: "hidden" }}
//         >
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             className="webcam"
//             videoConstraints={{ width: 320, height: 240 }}
//           />
//         </Modal.Body>
//       </Modal> */}

//       {/* <div class="modal fade" id="WebcamModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h1 class="modal-title fs-5" id="exampleModalLabel">Attendance</h1>
//         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body">
//       <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 className="webcam"
//                 videoConstraints={{ width: 320, height: 240 }}
//               />
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//       </div>
//     </div>
//   </div>
//       </div> */}
//     </div>
//   );