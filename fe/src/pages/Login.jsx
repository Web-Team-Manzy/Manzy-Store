import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { doLogin } from "../redux/action/accountAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [currentState, setCurrentState] = useState("Sign In");

    // >>> Backend Test Login API
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const message = useSelector((state) => state.account.errorMessage);
    const userInfo = useSelector((state) => state.account.userInfo);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // >>> Backend Test Login API
        dispatch(doLogin(email, password));
        // >>>
    };

    useEffect(() => {
        // show toast message when login success or fail
        if (message) {
            toast.error(message);
        } else if (userInfo.email) {
            toast.success("Login Success");
            navigate("/");
        }
    }, [message, userInfo]);

    // >>> End Backend Test Login API

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className="border-none h-[1.5px] w-8 bg-gray-800"></hr>
            </div>

            <input
                type="email"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Email"
                required=""
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            ></input>
            {currentState === "Sign In" ? (
                ""
            ) : (
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-800"
                            placeholder="First Name"
                            required=""
                        ></input>
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-800"
                            placeholder="Last Name"
                            required=""
                        ></input>
                    </div>
                </div>
            )}
            <input
                type="password"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Password"
                required=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            ></input>

            <div className="w-full flex justify-between text-sm mt-[-8px]">
                <p className=" cursor-pointer">Forgot your password?</p>
                {currentState === "Sign In" ? (
                    <p className="cursor-pointer" onClick={() => setCurrentState("Sign Up")}>
                        Create an account
                    </p>
                ) : (
                    <p className="cursor-pointer" onClick={() => setCurrentState("Sign In")}>
                        Sign In
                    </p>
                )}
            </div>
            <button className="bg-black text-white font-light px-8 py-2 mt-4">
                {currentState === "Sign In" ? "Sign In" : "Sign Up"}
            </button>
        </form>
    );
};

export default Login;
