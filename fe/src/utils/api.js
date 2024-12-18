import axios from "../customize/axios";

const createUserApi = async (email, password, firstName, lastName) => {
    const API_URL = "/register";

    return axios.post(API_URL, {
        email,
        password,
        firstName,
        lastName,
    });
};

export { createUserApi };
