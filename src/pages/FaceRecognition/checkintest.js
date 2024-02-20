import React, { useRef, useState , useEffect} from "react";
// import $ from "jquery"; // Make sure jQuery is installed in your project
import '../FaceRecognition/checkintest.css'


const MyComponent = () => {
    const [videoStream, setVideoStream] = useState(null);
    const videoRef = useRef(null);
    const imageRef = useRef(null);

    const handleCapture = () => {   
        if (!videoStream) return;

        const track = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        imageCapture
            .takePhoto()
            .then((blob) => {
                const img = new Image();
                console.log(img)
                img.src = URL.createObjectURL(blob);
                imageRef.current.appendChild(img);

                videoRef.current.classList.add("not-visible");
                
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;

                    const fd = new FormData();
                    // fd.append("csrfmiddlewaretoken", csrftoken);
                    fd.append("photo", base64data);

                    // $.ajax({
                    //     type: "POST",
                    //     url: "/classify/",
                    //     enctype: "multipart/form-data",
                    //     data: fd,
                    //     processData: false,
                    //     contentType: false,
                    //     success: (resp) => {
                    //         console.log(resp);
                    //         window.location.href = window.location.origin;
                    //     },
                    //     error: (err) => {
                    //         console.log(err);
                    //     },
                    // });
                }
            })
            .catch((error) => {
                console.log("takePhoto() error: ", error);
            });
    };

    const handleReload = () => {
        window.location.reload();
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

    // On component mount, setup the camera
    useEffect(() => {
        setupCamera();
    }, []);

    return (
        <div className="container">
            <div className="text-center">
                <video autoPlay={true} id="video-element" ref={videoRef}></video>
            </div>

            <div id="img-element" ref={imageRef}></div>

            <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={handleCapture}>Take Photo</button>
                <button className="btn btn-info" onClick={handleReload}>Reload</button>
            </div>
        </div>
    );
};

export default MyComponent;
