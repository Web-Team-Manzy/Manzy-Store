import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import {
  fetchSummaryStatistic,
  fetchProductsStatistic,
  fetchChartStatistic,
} from "../util/statisticsApiCall";
import ReactPaginate from "react-paginate";

const Statistic = () => {
  const [tag, setTag] = useState("day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [codOrders, setCodOrders] = useState(0);
  const [codRevenue, setCodRevenue] = useState(0);
  const [paymentOrders, setPaymentOrders] = useState(0);
  const [paymentRevenue, setPaymentRevenue] = useState(0);

  // Phân trang cho products sold
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState([]);

  const [showStatistic, setShowStatistic] = useState(false);

  const labels = statistics.map((stat) => stat.date);
  const revenueData = statistics.map((stat) => stat.totalRevenue);
  const ordersData = statistics.map((stat) => stat.totalOrders);

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
  const fetchData = async (startDate, endDate, selectedPage) => {
    const summeryStatisticData = await fetchSummaryStatistic(
      tag,
      startDate,
      endDate
    );
    console.log("summeryStatisticData", summeryStatisticData);

    if (summeryStatisticData) {
      setTotalOrders(summeryStatisticData.totalOrders);
      setTotalRevenue(summeryStatisticData.totalRevenue);
      setCodOrders(summeryStatisticData.codOrders);
      setCodRevenue(summeryStatisticData.codRevenue);
      setPaymentOrders(summeryStatisticData.paymentOrders);
      setPaymentRevenue(summeryStatisticData.paymentRevenue);
    }

    const productsStatisticData = await fetchProductsStatistic(
      tag,
      startDate,
      endDate,
      selectedPage
    );

    console.log("productsStatisticData", productsStatisticData);

    if (productsStatisticData) {
      setProducts(productsStatisticData.data);
      setTotalPages(productsStatisticData.pagination.pages);
      setCurrentPage(productsStatisticData.pagination.page);
    }

    const chartStatisticData = await fetchChartStatistic(
      tag,
      startDate,
      endDate
    );

    console.log("chartStatisticData", chartStatisticData);
    if (chartStatisticData) {
      setStatistics(chartStatisticData.statistics);
    }
  };

  const pieData = {
    labels: ["COD Orders", "Payment Orders"],
    datasets: [
      {
        data: [codOrders, paymentOrders],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const handleSearch = async () => {
    let adjustedStartDate = startDate;
    let adjustedEndDate = endDate;
    const today = new Date();

    setShowStatistic(true);

    if (tag === "month") {
      // Điều chỉnh startDate và endDate theo tháng
      const start = new Date(`${startDate}-01`);
      let end = new Date(`${endDate}-01`);
      end.setMonth(end.getMonth() + 1); // Sang tháng tiếp theo
      end.setDate(0); // Lấy ngày cuối cùng của tháng trước

      // Nếu end vượt quá ngày hiện tại, điều chỉnh lại
      if (end > today) {
        end = today;
      }

      adjustedStartDate = start.toISOString().split("T")[0];
      adjustedEndDate = end.toISOString().split("T")[0];
    } else if (tag === "year") {
      // Điều chỉnh startDate và endDate theo năm
      const startYear = parseInt(startDate, 10);
      const endYear = parseInt(endDate, 10);
      const start = new Date(`${startYear}-01-01`);
      let end = new Date(`${endYear}-12-31`);

      // Nếu end vượt quá ngày hiện tại, điều chỉnh lại
      if (end > today) {
        end = today;
      }

      adjustedStartDate = start.toISOString().split("T")[0];
      adjustedEndDate = end.toISOString().split("T")[0];
    }

    // Gọi fetchData với giá trị mới
    await fetchData(adjustedStartDate, adjustedEndDate, currentPage);
  };

  const handlePageClick = async (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
    console.log("start date", startDate);
    console.log("end date", endDate);
    fetchData(startDate, endDate, selectedPage);
  };

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
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>
      {showStatistic ? (
        <>
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
          </div>

          {/* Biểu đồ tròn */}
          <div className="flex justify-center my-8">
            <div className="w-64 h-64">
              <h3 className="text-xl font-bold mb-4 text-center">
                Order Types
              </h3>
              <Pie data={pieData} />
            </div>
          </div>

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
          {/* Thống kê theo sản phẩm */}
          <h2 className="text-xl font-bold mb-4">Products Sold</h2>
          <div className="flex flex-col gap-2">
            {/* List Table Title */}
            <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr] items-center px-1 py-2 border bg-gray-100 text-sm">
              <b>Image</b>
              <b>Product</b>
              <b>Price</b>
              <b>Sold</b>
            </div>

            {/* Product sold list */}
            {products.map((product, index) => (
              <div
                className="grid grid-cols-[1fr_3fr_1fr_1fr] md:grid-cols-[1fr_3fr-1fr_1fr] border items-center gap-2 px-2 py-1 text-sm"
                key={index}
              >
                <img
                  className="w-12"
                  src={
                    product.product.images && product.product.images.length > 0
                      ? product.product.images[0]
                      : "/no-image.jpg"
                  }
                  alt={product.product.name || "No image available"}
                />
                <p>{product.product.name}</p>
                <p>${product.product.price}</p>
                <p>{product.sold}</p>
              </div>
            ))}
            <ReactPaginate
              className="flex justify-center my-5 gap-3"
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={totalPages} // Số lượng trang
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"} // Lớp CSS cho container
              activeClassName={"active px-3"} // Lớp CSS cho trang hiện tại
            />
          </div>
        </>
      ) : (
        <h3 className="text-lg font-bold text-center">
          Trang thống kê nhập các trường dữ liệu để bắt đầu thống kê
        </h3>
      )}
    </div>
  );
};

export default Statistic;
