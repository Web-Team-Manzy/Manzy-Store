import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

import { doLogin, doLoginFacebook, doLoginGoogle } from "../redux/action/accountAction";
import { createUserApi, sendConfirmEmailApi } from "../utils/api";
import FacebookLogin from "@greatsumini/react-facebook-login";

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

        const res = await sendConfirmEmailApi(email);

        if (res && res.EC === 0) {
            toast.success("Verification code sent to your email.");
            setIsCodeSent(true);
        } else {
            toast.error(res.EM);
        }
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

        if (currentState === "Sign In") {
            dispatch(doLogin(email, password));
        } else if (currentState === "Sign Up") {
            // Kiểm tra độ dài mật khẩu
            if (password.length < 6) {
                toast.error("Password must be at least 6 characters.");
                return;
            }

            // Kiểm tra mật khẩu nhập lại
            if (password !== confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }

            // Kiểm tra số điện thoại đúng 10 số
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone)) {
                toast.error("Phone number must be exactly 10 digits.");
                return;
            }

            // Gửi yêu cầu tạo tài khoản
            const res = await createUserApi(email, password, phone, name, verificationCode);
            if (res && res.EC === 0) {
                toast.success("Account created successfully!");
                setCurrentState("Sign In");
            } else {
                toast.error(res.EM);
            }
        }
    };

    const handleLoginGoogle = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "popup",
        onSuccess: async (res) => {
            dispatch(doLoginGoogle(res.code));
        },
        onError: (error) => {
            console.error("Google login error:", error);
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                        {currentState}
                    </h2>

                    {/* Email input */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={currentState === "Sign Up" && isCodeSent}
                    />

                    {currentState === "Sign In" && (
                        <>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Sign In
                            </button>

                            <div className="flex justify-between text-sm text-blue-500 mt-[-6px]">
                                <p className="cursor-pointer hover:underline">
                                    Forgot your password?
                                </p>
                                <p
                                    className="cursor-pointer hover:underline"
                                    onClick={() => setCurrentState("Sign Up")}
                                >
                                    Create an account
                                </p>
                            </div>
                        </>
                    )}

                    {currentState === "Sign Up" && (
                        <>
                            {!isCodeSent && (
                                <button
                                    type="button"
                                    onClick={sendVerificationCode}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                                >
                                    Send Verification Code
                                </button>
                            )}

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
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                                    >
                                        Create Account
                                    </button>
                                </>
                            )}

                            <p
                                className="cursor-pointer hover:underline text-sm text-blue-500 mt-2"
                                onClick={() => setCurrentState("Sign In")}
                            >
                                Already have an account? Sign In
                            </p>
                        </>
                    )}
                </form>

                {currentState === "Sign In" && (
                    <>
                        <div className="flex flex-col items-center mt-4">
                            <p className="text-sm text-gray-500 mb-2">or continue with</p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLoginGoogle();
                                }}
                                className="flex items-center justify-center w-64 bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition"
                            >
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-5 h-5 mr-2"
                                />
                                <span className="text-sm font-medium">Sign in with Google</span>
                            </button>
                        </div>

                        <div className="flex flex-col items-center mt-4">
                            <FacebookLogin
                                appId={`${import.meta.env.VITE_APP_FB_CLIENT_ID}`}
                                onSuccess={(response) => {
                                    console.log("Login Success!", response);
                                }}
                                onFail={(error) => {
                                    console.log("Login Failed!", error);
                                }}
                                onProfileSuccess={(response) => {
                                    console.log("Get Profile Success!", response);

                                    dispatch(
                                        doLoginFacebook(response.id, response.name, response.email)
                                    );
                                }}
                                children={
                                    <>
                                        <div className="flex items-center justify-center w-64 bg-blue-600 text-white border border-gray-300 rounded-md px-3 py-2 shadow-sm hover:shadow-md transition">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                                alt="Facebook"
                                                className="w-5 h-5 mr-2"
                                            />
                                            <span className="text-sm font-medium">
                                                Sign in with Facebook
                                            </span>
                                        </div>
                                    </>
                                }
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
