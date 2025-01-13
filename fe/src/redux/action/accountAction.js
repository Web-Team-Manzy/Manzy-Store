import axios from "../../customize/axios";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

export const USER_UPDATE_REQUEST = "USER_UPDATE_REQUEST";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAIL = "USER_UPDATE_FAIL";

export const GET_ACCOUNT_BALANCE_REQUEST = "GET_ACCOUNT_BALANCE_REQUEST";
export const GET_ACCOUNT_BALANCE_SUCCESS = "GET_ACCOUNT_BALANCE_SUCCESS";
export const GET_ACCOUNT_BALANCE_FAIL = "GET_ACCOUNT_BALANCE_FAIL";

export const doGetAccountBalance = (userId) => {
    return async (dispatch, getState) => {
        dispatch({
            type: GET_ACCOUNT_BALANCE_REQUEST,
        });

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/balance`,
                {
                    withCredentials: true,
                }
            );

            if (response && +response.EC === 0) {
                dispatch({
                    type: GET_ACCOUNT_BALANCE_SUCCESS,
                    balance: response.DT.balance,
                });
            } else {
                dispatch({
                    type: GET_ACCOUNT_BALANCE_FAIL,
                    error: response.EM,
                });
            }
        } catch (error) {
            dispatch({
                type: GET_ACCOUNT_BALANCE_FAIL,
                error: error.message,
            });
        }
    };
};

export const doUpdateAccount = (userId, updatedUserData) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_UPDATE_REQUEST,
        });

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/users/` + userId,
                updatedUserData,
                {
                    withCredentials: true,
                }
            );
            if (response && +response.EC === 0) {
                const filteredData = {
                    id: response.DT._id,
                    email: response.DT.email,
                    displayName: response.DT.displayName,
                    role: response.DT.role,
                    address: response.DT.address,
                    phone: response.DT.phone,
                };
                dispatch({
                    type: USER_UPDATE_SUCCESS,
                    user: filteredData,
                });
            } else {
                dispatch({
                    type: USER_UPDATE_FAIL,
                    error: response.EM,
                });
            }
        } catch (error) {
            console.log(">>> error: ", error);
            dispatch({
                type: USER_UPDATE_FAIL,
                error: error.message,
            });
        }
    };
};

export const doLogin = (email, password) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        axios
            .post(
                `${import.meta.env.VITE_BACKEND_URL}/login`,
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                console.log(">>> response: ", response);
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        user: response?.DT?.user || {},
                        accessToken: response?.DT?.accessToken || "",
                        refreshToken: response?.DT?.refreshToken || "",
                        isDoLogin: true,
                    });
                } else {
                    dispatch({
                        type: USER_LOGIN_FAIL,
                        error: response.EM,
                        isDoLogin: true,
                    });
                }
            })
            .catch((error) => {
                console.log(">>> error: ", error);
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: error,
                    isDoLogin: true,
                });
            });
    };
};

export const doLoginGoogle = (code) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        axios
            .post(
                `${import.meta.env.VITE_BACKEND_URL}/login/google`,
                {
                    code,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                console.log(">>> response: ", response);
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        user: response?.DT?.user || {},
                        accessToken: response?.DT?.accessToken || "",
                        refreshToken: response?.DT?.refreshToken || "",
                        isDoLogin: true,
                    });
                } else {
                    dispatch({
                        type: USER_LOGIN_FAIL,
                        error: response.EM,
                        isDoLogin: true,
                    });
                }
            })
            .catch((error) => {
                console.log(">>> error: ", error);
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: error,
                    isDoLogin: true,
                });
            });
    };
};

export const doLoginFacebook = (id, name, email) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        axios
            .post(
                `${import.meta.env.VITE_BACKEND_URL}/login/facebook`,
                {
                    id,
                    name,
                    email,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                console.log(">>> response: ", response);
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        user: response?.DT?.user || {},
                        accessToken: response?.DT?.accessToken || "",
                        refreshToken: response?.DT?.refreshToken || "",
                        isDoLogin: true,
                    });
                } else {
                    dispatch({
                        type: USER_LOGIN_FAIL,
                        error: response.EM,
                        isDoLogin: true,
                    });
                }
            })
            .catch((error) => {
                console.log(">>> error: ", error);
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: error,
                    isDoLogin: true,
                });
            });
    };
};

export const doGetAccount = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/account`, {
                withCredentials: true,
            })
            .then((response) => {
                console.log(">>> response: ", response);
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        user: response?.DT?.user || {},
                        accessToken: response?.DT?.accessToken || "",
                        refreshToken: response?.DT?.refreshToken || "",
                    });
                } else {
                    dispatch({
                        type: USER_LOGIN_FAIL,
                        error: response.EM,
                    });
                }
            })
            .catch((error) => {
                console.log(">>> error: ", error);
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: error,
                });
            });
    };
};

export const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const USER_LOGOUT_FAIL = "USER_LOGOUT_FAIL";

export const doLogout = (email) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGOUT_REQUEST,
        });

        axios
            .post(
                `${import.meta.env.VITE_BACKEND_URL}/logout`,
                {
                    email,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                console.log(">>> response: ", response);
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGOUT_SUCCESS,
                    });
                } else {
                    dispatch({
                        type: USER_LOGOUT_FAIL,
                        error: response.EM,
                    });
                }
            })
            .catch((error) => {
                console.log(">>> error: ", error);
                dispatch({
                    type: USER_LOGOUT_FAIL,
                    error: error,
                });
            });
    };
};
