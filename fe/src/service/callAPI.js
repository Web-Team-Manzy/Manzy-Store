import axios from "../customize/axios";

export const getProducts = async (
    page = 1,
    category = "",
    subCategory = "",
    search = "",
    sortField = "name",
    sortOrder = "asc",
    limit = 8,
    bestseller = ""
) => {
    return await axios.get(
        `/product/list?page=${page}&limit=${limit}&category=${category}&subCategory=${subCategory}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}&bestseller=${bestseller}`
    );
};

export const getDetailProduct = async (productId) => {
    return await axios.get(`/product/detail/${productId}`);
};

export const getRelatedProducts = async (productId) => {
    return await axios.get(`/product/related/${productId}`);
};

export const addToCart = async (itemId, size) => {
    return await axios.post("/cart/add", { itemId, size });
};

export const getCart = async () => {
    return await axios.post("/cart/get");
};

export const lastProduct = async () => {
    return await axios.get("/product/listNewProduct");
};

export const updateCartQuantity = async (itemId, size, quantity) => {
    return await axios.post("/cart/update", { itemId, size, quantity });
};

export const requireOrderConfirmationPin = async () => {
    return await axios.post("/order/confirmation-pin");
};

export const confirmEmail = async (transactionPin, items, amount, address, paymentMethod) => {
    return await axios.post("/order/place", {
        transactionPin,
        items,
        amount,
        address,
        paymentMethod,
    });
};

export const sendEmailConfirmationPin = async (email) => {
    return await axios.post("/confirmation-pin", { email });
};
