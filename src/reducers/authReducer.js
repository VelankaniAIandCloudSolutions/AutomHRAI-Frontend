const userdetails = localStorage.getItem("userAccount");
const initialState = {
  loggedIn: localStorage.getItem("token") !== null,
  userData: userdetails !== null ? JSON.parse(userdetails) : null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "login":
      return {
        loggedIn: true,
        userData: action.payload,
      };
    case "logout":
      return {
        loggedIn: false,
        userData: null,
      };
    default:
      return state;
  }
};
export default authReducer;
