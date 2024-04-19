import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/dist/js/adminlte.min.js";
// import "./interceptors/axios";
import axios from "axios";
import { createStore, combineReducers } from "redux";
import loadingReducer from "./reducers/loadingReducer";
import authReducer from "./reducers/authReducer";
import { Provider } from "react-redux";

axios.defaults.baseURL = "https://ai.automhr.com/api/v1/";
const rootReducer = combineReducers({
  loading: loadingReducer,
  auth: authReducer,
});

const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
