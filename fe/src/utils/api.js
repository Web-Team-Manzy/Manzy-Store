import axios from "../customize/axios";

const sendConfirmEmailApi = async (email) => {
    const API_URL = "/comfirmation-pin";

    return axios.post(API_URL, {
        email,
    });
};

const createUserApi = async (
    email,
    password,
    phone,
    name = { firstName: "", lastName: "", displayName: "" },
    transactionPin
) => {
    const API_URL = "/register";

    return axios.post(API_URL, {
        email,
        password,
        phone,
        name,
        transactionPin,
    });
};

export { createUserApi, sendConfirmEmailApi };
