import axios from "../customize/axios";

export const getProducts = async (
  page = 1,
  category = "",
  search = "",
  limit = 7,
  sortField = "name",
  sortOrder = "asc",
  bestseller = ""
) => {
  return await axios.get(
    `/product/list?page=${page}&limit=${limit}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}&bestseller=${bestseller}`
  );
};

export const getDetailProduct = async (productId) => {
  return await axios.get(`/product/detail/${productId}`);
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

export const updateCart = async (itemId, size) => {
  return await axios.post("/cart/update", { itemId, size, quantity: 0 });
};
