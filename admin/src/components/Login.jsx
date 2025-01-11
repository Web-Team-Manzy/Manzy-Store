/* eslint-disable no-unused-vars */
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "../customize/axios";
import { useState } from "react";
import useAuthStore from "../stores/authStore";
import PropTypes from "prop-types";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post("/login", {
        email,
        password,
      });
      console.log(response);
      if (response.EC === 0 && response.DT.user.role === "admin") {
        login(response.DT.user);
        setToken(response.DT.accessToken);
      } else {
        toast.error("Invalid email or password || Not an admin account");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md bg-black text-white"
            type="submit"
          >
            {" "}
            Login{" "}
          </button>
        </form>
      </div>
    </div>
  );
};
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
export default Login;
