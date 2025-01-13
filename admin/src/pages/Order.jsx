/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../customize/axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllOrders = async (page = 1, limit = 5) => {
    if (!token) return null;

    try {
      const response = await axios.post(
        `/order/list?page=${page}&limit=${limit}`,
        {}
      );

      if (response.success) {
        toast.success(response.message);
        setOrders(response.orders);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchAllOrders(selectedPage);
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post("/order/status", {
        orderId,
        status: event.target.value,
      });

      if (response.success) {
        fetchAllOrders();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    toast.success("Status updated successfully!");
    fetchAllOrders(currentPage);
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, itemIndex) => {
                  return (
                    <div key={itemIndex}>
                      <p className="py-0.5 font-medium">{item.product.name}</p>
                      {Object.entries(item.sizes).map(
                        ([size, quantity], sizeIndex) => (
                          <p key={sizeIndex} className="text-gray-500">
                            Size: {size} x {quantity}
                          </p>
                        )
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 mb-2 font-medium">
                Customer: {order.displayName}{" "}
              </p>

              <div>
                <p>{order.address.stress + ","}</p>
                <p>
                  {order.address.city +
                    "," +
                    order.address.district +
                    "," +
                    order.address.ward}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method : {order.paymentMethod}</p>
              <p>Payment : {order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select
              className="p-2 font-semibold"
              value={order.status}
              onChange={(event) => statusHandler(event, order._id)}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
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
  );
};

Order.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Order;
