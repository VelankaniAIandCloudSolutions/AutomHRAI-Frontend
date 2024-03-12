import React from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
function LoadingScreen() {
    const loadingScreenStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background
        width: '100%',
        height: '100%',
        // zIndex: 9999, // Make sure it's on top of other elements
      };   
      const isLoading=useSelector((state)=>state.loading.loading); 
  return isLoading ?
   
          <div style={loadingScreenStyle}>
      <ReactLoading type={'spinningBubbles'} color={'#A1A6AB'} height={80} width={80} />
    </div>:null;
   
  
}

export default LoadingScreen
