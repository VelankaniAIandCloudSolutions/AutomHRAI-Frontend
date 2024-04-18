import React from "react";

function LoadingScreen() {
  const loadingScreenStyle = {
    position: "fixed",
    display: "flex",
    top: "50%",
    left: "50%",
    width: "5rem",
    height: "5rem",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999999999,
  };

  const backdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999999999998,
  };

  return (
    <div>
      <div style={backdropStyle}></div>
      <div className="container">
        <div
          className="spinner-border text-primary"
          style={loadingScreenStyle}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
