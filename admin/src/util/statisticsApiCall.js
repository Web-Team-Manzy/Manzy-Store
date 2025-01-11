import axios from "../customize/axios";
import { toast } from "react-toastify";

export const fetchSummaryStatistic = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`/statistic/total`, {
      params: { tag, startDate, endDate },
    });
    return response;
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch total orders");
    return null;
  }
};

export const fetchProductsStatistic = async (
  tag,
  startDate,
  endDate,
  page,
  limit
) => {
  try {
    const response = await axios.get(`/statistic/product`, {
      params: { tag, startDate, endDate, page, limit },
    });
    if (response.success) {
      return response;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch products sold");
    return null;
  }
};

export const fetchBestSellerProducts = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`/statistic/bestSeller`, {
      params: { tag, startDate, endDate },
    });
    if (response.success) {
      return response;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch best seller products");
    return null;
  }
};

export const fetchChartStatistic = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`/statistic/chart`, {
      params: { tag, startDate, endDate },
    });
    return response;
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch chart statistics");
    return null;
  }
};

export const updateBestSellerProducts = async (startDate, endDate, token) => {
  console.log("token", token);
  try {
    const response = await axios.post(
      `/product/updateBestSeller?startDate=${startDate}&endDate=${endDate}`,
      {}
    );

    if (response.success) {
      toast.success(response.message);
      return response.message;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update best seller products");
    return null;
  }
};
