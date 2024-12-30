import axios from "../customize/axios";

const createUserApi = async (
    email,
    password,
    phone,
    name = { firstName: "", lastName: "", displayName: "" }
) => {
    const API_URL = "/register";

    return axios.post(API_URL, {
        email,
        password,
        phone,
        name,
    });
};

export { createUserApi };
