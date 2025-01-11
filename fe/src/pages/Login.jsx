import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { doLoginGoogle } from "../redux/action/accountAction";
import { createUserApi } from "../utils/api";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign In");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector((state) => state.account.errorMessage);
  const userInfo = useSelector((state) => state.account.userInfo);
  const isDoLogin = useSelector((state) => state.account.isDoLogin);

  useEffect(() => {
    if (message) {
      if (isDoLogin) {
        toast.error(message);
      }
    } else if (userInfo.email) {
      if (isDoLogin) {
        toast.success("Login success!");
      }
      navigate("/");
    }
  }, [message, userInfo]);

  const sendVerificationCode = async () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    // Simulate sending verification code
    setIsCodeSent(true);
    toast.success("Verification code sent to your email.");
  };

  const verifyCode = async () => {
    if (verificationCode === "123456") {
      // Simulated verification code
      setIsCodeVerified(true);
      toast.success("Email verified successfully.");
    } else {
      toast.error("Invalid verification code.");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign Up") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const res = await createUserApi(email, password, phone, name);
      if (res && res.EC === 0) {
        toast.success("Account created successfully!");
        setCurrentState("Sign In");
      } else {
        toast.error(res.EM);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {currentState === "Sign Up" ? "Create Account" : "Sign In"}
          </h2>

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isCodeSent}
          />

          {/* Send Verification Code Button */}
          {!isCodeSent && (
            <button
              type="button"
              onClick={sendVerificationCode}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Send Verification Code
            </button>
          )}

          {/* Verification Code Input */}
          {isCodeSent && !isCodeVerified && (
            <>
              <input
                type="text"
                placeholder="Enter Verification Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={verifyCode}
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-green-800 hover:scale-105 transform transition-all duration-300 ease-in-out"
              >
                Verify Code
              </button>
            </>
          )}

          {/* Password and Additional Info */}
          {isCodeVerified && (
            <>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={name.displayName}
                onChange={(e) =>
                  setName({ ...name, displayName: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          {/* Submit Button */}
          {isCodeVerified && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
