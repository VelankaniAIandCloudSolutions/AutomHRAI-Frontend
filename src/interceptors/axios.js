// import axios from "axios";
// axios.defaults.baseURL = "http://localhost:8000/api/v1/";
// if (localStorage.getItem("access_token")) {
//   axios.defaults.headers.common[
//     "Authorization"
//   ] = `Bearer ${localStorage.getItem("access_token")}`;
// }
// let refresh = false;
// axios.interceptors.response.use(
//   (resp) => resp,
//   async (error) => {
//     if (error.response.status === 401 && !refresh) {
//       refresh = true;
//       const response = await axios.post("/token/refresh/", {
//         refresh: localStorage.getItem("refresh_token"),
//       });
//       if (response.status === 200) {
//         axios.defaults.headers.common["Authorization"] = `Bearer
//        ${response.data["access"]}`;
//         localStorage.setItem("access_token", response.data.access);
//         localStorage.setItem("refresh_token", response.data.refresh);
//         return axios(error.config);
//       }
//     }
//     refresh = false;
//     return error;
//   }
// );
// // export default axios;
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../actions/authActions";
const useAxiosInterceptor = () => {
  const dispatch = useDispatch();

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        dispatch(logoutAction());
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export default useAxiosInterceptor;
