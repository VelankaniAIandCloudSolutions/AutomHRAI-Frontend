import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Modal } from 'react-bootstrap';

function CheckInCheckOut() {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showWebcamModal, setshowWebcamModal ]=useState(false);
  const handleClose=()=>{
    setshowWebcamModal(false);
}

  const capture = () => {
    // const imageSrc = webcamRef.current.getScreenshot();
    // setImageSrc(imageSrc);
  };

  const handleCheckIn = () => {
    // Implement your check-in logic here
    console.log('Checked In');
    setshowWebcamModal(true);
  };

  const handleCheckOut = () => {
    // Implement your check-out logic here
    console.log('Checked Out');
    setshowWebcamModal(true);
  };

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* <div className="col-3"> */}
              <h1>Attendance</h1>
            {/* </div>           */}
            {/* <div className="col-0"> */}
              <span className="mx-3">|</span>
            {/* </div> */}
            {/* <div className="col-9"> */}
              <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/"> <i className="fas fa-home"></i> Home</a></li>
                  <li className="breadcrumb-item active" aria-current="page"><i className="fas fa-list"> </i> Attendance</li>
                </ol>
              </nav>
            {/* </div> */}
            
           
          </div>
        </div>

        <div className="card-container mt-4 mx-auto" style={{ maxWidth: '400px' }}>

        <div className="card mx-auto" style={{ width: '100%' }}>
            <h5 className="card-header">Attendance</h5>
            <div className="card-body text-center">
            {/* <div className="blank-container"></div> */}
            {/* <div className="bg-light p-2"></div> */}
            <div className="d-flex align-items-center justify-content-center">

            <div className="bg-light p-2 mt-4" style={{ borderRadius: '50%', width: '150px', height: '150px', border: '5px solid #e3e3e3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  <h4>0.0 Hrs</h4>
</div>


</div>

              {/* <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{ width: 320, height: 240 }} 
              /> */}
              <div className="mt-5 mb-5">
                {/* <button className="btn btn-primary mx-2" onClick={capture}>Capture</button> */}
                <button className="btn btn-primary mx-2"  onClick={handleCheckIn}><i className="fas fa-user-check" ></i> Check In</button>
                <button className="btn btn-primary mx-2" onClick={handleCheckOut}><i className="fas fa-user-clock" ></i> Check Out</button>
              </div>
              {imageSrc && (
                <div className="mt-3">
                  <img src={imageSrc} alt="Captured" className="captured-image" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <Modal show={showWebcamModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center" style={{ height: '300px', overflow: 'hidden' }}>
         <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{ width: 320, height: 240 }} 
              />
        </Modal.Body>
      </Modal>

      {/* <div class="modal fade" id="WebcamModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Attendance</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{ width: 320, height: 240 }} 
              />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
      </div> */}
    </div>
  );
}

export default CheckInCheckOut;
