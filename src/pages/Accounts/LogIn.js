import axios from "axios";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    const { data } = await axios.post("/token/", user, {
      headers: { "Content-Type": "application/json" },
    });

    localStorage.clear();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;
    getUserAccount();
  };

  const getUserAccount = async () => {
    await axios
      .get("/accounts/get-user-account/")
      .then((response) => {
        const data = response.data;
        localStorage.setItem("userAccount", JSON.stringify(data));
        
        window.location.href = "/";
        toast.success('Logged in successfully');
        
      })
      .catch((error) => {
        console.error("Error fetching user account:", error);
      });
  };

  return (
    
    <div className="container-fluid">
            <div className="row min-vh-100 justify-content-center align-items-center">
        <div className="col-md-4">

    <div className="Auth-form-container">
    <div className="card-container">
            <div className="card">
      <form className="Auth-form mx-5 my-5" onSubmit={submit} >
        <div className="Auth-form-content ">
          <h3 className="Auth-form-title text-center">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              className="form-control mt-1"
              placeholder="Enter Email"
              name="email"
              type="text"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
      </div>
      </div>
    </div>
    </div>
    </div>
    </div>
  );
};
