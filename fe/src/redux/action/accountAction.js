import axios from "../../customize/axios";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

export const doLogin = (email, password) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        axios
            .post(
                "http://localhost:8080/login",
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                if (response && +response.EC === 0) {
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        data: response.DT,
                    });
                } else {
                    dispatch({
                        type: USER_LOGIN_FAIL,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: USER_LOGIN_FAIL,
                });
            });
    };
};
