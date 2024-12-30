import axios from "../customize/axios";

export const getProducts = async (
  page = 1,
  category = "",
  limit = 7,
  sortField = "name",
  sortOrder = "asc",
  search = "",
  bestseller = ""
) => {
  return await axios.get(
    `/product/list?page=${page}&limit=${limit}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}&bestseller=${bestseller}`
  );
};

export const getDetailProduct = async (productId) => {
  return await axios.get(`/product/detail/${productId}`);
};

export const addToCart = async (userId, itemId, size) => {
  return await axios.post("/cart/add", { userId, itemId, size });
};

export const getCart = async (userId) => {
  return await axios.post("/cart/get", { userId });
};

export const lastProduct = async () => {
  return await axios.get("/product/listNewProduct");
};
