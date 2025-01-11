import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const fetchSummaryStatistic = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`${backendUrl}/statistic/total`, {
      params: { tag, startDate, endDate },
    });
    if (response.status === 200) {
      return response.data;
    }
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
    const response = await axios.get(`${backendUrl}/statistic/product`, {
      params: { tag, startDate, endDate, page, limit },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch products sold");
    return null;
  }
};

export const fetchBestSellerProducts = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`${backendUrl}/statistic/bestSeller`, {
      params: { tag, startDate, endDate },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch best seller products");
    return null;
  }
};

export const fetchChartStatistic = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`${backendUrl}/statistic/chart`, {
      params: { tag, startDate, endDate },
    });
    if (response.status === 200) {
      return response.data;
    }
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
      `${backendUrl}/product/updateBestSeller?startDate=${startDate}&endDate=${endDate}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to update best seller products");
    return null;
  }
};
