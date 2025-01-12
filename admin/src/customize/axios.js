/* eslint-disable no-unused-vars */
import axios from "axios";
import axiosRetry from "axios-retry";
import useAuthStore from "../stores/authStore";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        return error.response.status === 500 || error.response.status === 419;
    },
    retryDelay: (retryCount, error) => {
        return retryCount * 1000;
    },
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // const accessToken = useAuthStore((state) => state.accessToken);
        const { accessToken } = useAuthStore.getState();
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        return response && response.data ? response.data : response;
    },
    async function (error) {
        console.log(">>> error interceptors: ", error);
        const originalRequest = error.config;

        if(error.response?.status == 401 && !originalRequest._retry){
            console.log(">>>>> response 401 in if intercepters", error.response);
            originalRequest._retry = true;
            try {
                const { refreshToken} = useAuthStore.getState();

                if(refreshToken){ 
                    const newAccessToken = await useAuthStore.getState().doGetAccount();
                    if(newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest);
                    }
                }
                
            } catch (refreshError) {
                console.error("Token refresh failed: ", refreshError);
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }

        if (error && error.response && error.response.data) {
            return error.response.data;
        }

        return Promise.reject(error);
    }
);

export default instance;
