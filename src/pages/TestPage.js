import React, { useEffect } from "react";
import axios from "axios";
export default function TestPage() {
  useEffect(() => {
    console.log("TestPage mounted");
    console.log(axios.defaults.baseURL);
    console.log(axios.defaults.headers);
    checkLogin();
  }, []);

  const checkLogin = async () => {
    console.log("checkLogin");
    await axios
      .get("accounts/check-login")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  return <div>Hello</div>;
}
