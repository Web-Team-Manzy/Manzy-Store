import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const fetchTotalOrders = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/orders/count`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch total orders");
    return null;
  }
};

export const fetchTotalRevenue = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/revenue/total`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch total revenue");
    return null;
  }
};

export const fetchProductsSold = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/products/sold`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch products sold");
    return null;
  }
};

export const fetchCategoriesSold = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/categories/sold`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch categories sold");
    return null;
  }
};

export const fetchAverageOrderValue = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/orders/average-value`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch average order value");
    return null;
  }
};

export const fetchOrderStatus = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/orders/status`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch order status");
    return null;
  }
};

export const fetchPaymentMethods = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/statistics/orders/payment-method`,
      {
        params: { tag, startDate, endDate },
      }
    );
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch payment methods");
    return null;
  }
};

export const fetchChartStatistics = async (tag, startDate, endDate) => {
  try {
    const response = await axios.get(`${backendUrl}/api/statistics/chart`, {
      params: { tag, startDate, endDate },
    });
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch chart statistics");
    return null;
  }
};
