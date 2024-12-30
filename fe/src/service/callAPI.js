import axios from "../customize/axios";

export const getProducts = async (
  page = 1,
  category = "",
  limit = 7,
  sortField = "name",
  sortOrder = "asc",
  search = ""
) => {
  // Kiểm tra giá trị của category
  console.log("Calling API with category: ", category);

  return await axios.get(
    `/product/list?page=${page}&limit=${limit}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`
  );
};

export const getDetailProduct = async (productId) => {
  return await axios.get(`/product/detail/${productId}`);
};

export const addToCart = async (userId, itemId, size) => {
  console.log("Calling API with userId: ", userId);
  console.log("Calling API with itemId: ", itemId);
  console.log("Calling API with size: ", size);
  return await axios.post("/cart/add", { userId, itemId, size });
};
