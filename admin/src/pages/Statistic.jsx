import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import {
  fetchTotalOrders,
  fetchTotalRevenue,
  fetchProductsSold,
  fetchCategoriesSold,
  fetchAverageOrderValue,
  fetchOrderStatus,
  fetchPaymentMethods,
  fetchChartStatistics,
} from "../util/statisticsApiCall";

const Statistic = () => {
  const [tag, setTag] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [averageRevenueOrder, setAverageRevenueOrder] = useState(0);
  const [orderStatus, setOrderStatus] = useState();
  const [orderPayment, setOrderPayment] = useState();
  // const [statistics, setStatistics] = useState([]);
  const [statistics, setStatistics] = useState([
    {
      date: "2025-01-01",
      totalOrders: 10,
      totalRevenue: 5000,
    },
    {
      date: "2025-01-02",
      totalOrders: 15,
      totalRevenue: 7500,
    },
    {
      date: "2025-01-03",
      totalOrders: 8,
      totalRevenue: 4000,
    },
  ]);

  const labels = statistics.map((stat) => stat.date);
  const revenueData = statistics.map((stat) => stat.totalRevenue);
  const ordersData = statistics.map((stat) => stat.totalOrders);

  const orderStatusLabels = orderStatus ? Object.keys(orderStatus) : [];
  const orderStatusData = orderStatus ? Object.values(orderStatus) : [];

  const getDateInputType = () => {
    switch (tag) {
      case "day":
        return "date";
      case "month":
        return "month";
      case "year":
        return "number";
    }
  };
  const getYearMax = () => new Date().getFullYear();

  const handleYearInputChange = (e, setDate) => {
    const value = parseInt(e.target.value, 10);
    const yearMin = 2000;
    const yearMax = new Date().getFullYear();

    // Kiểm tra giá trị hợp lệ
    if (value < yearMin) {
      toast.error(`Year cannot be less than ${yearMin}`);
      setDate(yearMin);
    } else if (value > yearMax) {
      toast.error(`Year cannot be greater than ${yearMax}`);
      setDate(yearMax);
    } else {
      setDate(value);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const ordersData = await fetchTotalOrders(tag, startDate, endDate);
  //     if (ordersData) setTotalOrders(ordersData.totalOrders);

  //     const revenueData = await fetchTotalRevenue(tag, startDate, endDate);
  //     if (revenueData) setTotalRevenue(revenueData.totalRevenue);

  //     const productsData = await fetchProductsSold(tag, startDate, endDate);
  //     if (productsData) setProducts(productsData.products);

  //     const categoriesData = await fetchCategoriesSold(tag, startDate, endDate);
  //     if (categoriesData) setCategories(categoriesData.categories);

  //     const averageValueData = await fetchAverageOrderValue(
  //       tag,
  //       startDate,
  //       endDate
  //     );
  //     if (averageValueData)
  //       setAverageRevenueOrder(averageValueData.averageOrderValue);

  //     const statusData = await fetchOrderStatus(tag, startDate, endDate);
  //     if (statusData) setOrderStatus(statusData.orderStatus);

  //     const paymentData = await fetchPaymentMethods(tag, startDate, endDate);
  //     if (paymentData) setOrderPayment(paymentData.paymentMethods);

  //     const chartData = await fetchChartStatistics(tag, startDate, endDate);
  //     if (chartData) setStatistics(chartData.statistics);
  //   };

  //   fetchData();
  // }, [tag, startDate, endDate]);

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-bold mb-4">Statistics</p>

      {/* Tag thống kê */}
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          name="tag"
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>

        {/* Input cho Start Date */}
        <input
          type={getDateInputType()}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={(e) => {
            if (tag === "year") handleYearInputChange(e, setStartDate);
          }}
          className="border p-2 rounded"
          placeholder={tag == "year" ? "YYYY" : ""}
          min={tag === "year" ? 2000 : undefined}
          max={tag === "year" ? getYearMax() : undefined}
        />

        {/* Input cho End Date */}
        <input
          type={getDateInputType()}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={(e) => {
            if (tag === "year") handleYearInputChange(e, setEndDate);
          }}
          className="border p-2 rounded"
          placeholder={tag == "year" ? "YYYY" : ""}
          min={tag === "year" ? 2000 : undefined}
          max={tag === "year" ? getYearMax() : undefined}
        />
      </div>

      {/* Thống kê tổng quát */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold"> Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold">Total Revenue</h3>
          <p>${totalRevenue}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-bold">Average Order Value</h3>
          <p>${averageRevenueOrder}</p>
        </div>
      </div>

      {/* Thống kê theo sản phẩm */}
      <h2 className="text-xl font-bold mb-4">Products Sold</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {products.map((product) => {
          <div key={product.productId} className="p-4 bg-white rounded shadow">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="text-lg font-bold mt-2">{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Sold: {product.sold}</p>
          </div>;
        })}
      </div>
      {/* Thống kê trạng thái đơn hàng */}
      <h2 className="text-xl font-bold mb-4">Order Status</h2>
      <Bar
        data={{
          labels: orderStatusLabels,
          datasets: [
            {
              label: "Order Status",
              data: orderStatusData,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        }}
      />

      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">
          Revenue and Orders Statistics
        </h2>
        <Bar
          data={{
            labels,
            datasets: [
              {
                type: "bar",
                label: "Revenue",
                data: revenueData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                yAxisID: "y1",
              },
              {
                type: "line",
                label: "Total Orders",
                data: ordersData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                fill: false,
                tension: 0.3,
                yAxisID: "y2",
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y1: {
                type: "linear",
                display: true,
                position: "left",
                title: {
                  display: true,
                  text: "Revenue",
                },
              },
              y2: {
                type: "linear",
                display: true,
                position: "right",
                title: {
                  display: true,
                  text: "Total Orders",
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Statistic;
