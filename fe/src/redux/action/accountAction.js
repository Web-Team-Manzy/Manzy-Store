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
        "http://localhost:8080/login/google",
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

export const doGetAccount = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    axios
      .get("http://localhost:8080/account", {
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
        "http://localhost:8080/logout",
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
