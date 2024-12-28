import axios from "../customize/axios";

export const getCategories = async () => {
  return await axios.get("/category/list");
};

export const getProducts = async (
  page = 1,
  category = "",
  limit = 7,
  sortField = "name",
  sortOrder = "asc",
  search = ""
) => {
  return await axios.get(
    `/product/list?page=${page}&limit=${limit}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`
  );
};
