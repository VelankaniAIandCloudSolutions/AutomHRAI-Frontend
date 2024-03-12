const userdetails=localStorage.getItem("userAccount");
const initialState={
    loggedIn: userdetails !== null,
    userData: userdetails !== null ? JSON.parse(userdetails) : null,
}

const authReducer = (state = initialState, action) => {
    console.log("Received action:", action);
    switch (action.type) {
      case 'login':
        console.log("Logging in with payload:", action.payload); 
        return {
          loggedIn: true,
          userData: action.payload,
        };
      case 'logout':
        console.log("Logging out");
        return {
          loggedIn: false,
          userData: null,
        };
      default:
        return state;        
    }
  }
export default authReducer;