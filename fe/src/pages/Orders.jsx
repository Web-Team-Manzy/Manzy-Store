import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "../customize/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const userInfo = useSelector((state) => state.account.userInfo);

  const fetchOrder = async (page = 1, limit = 2) => {
    try {
      const response = await axios.post(
        `/order/userOrders?page=${page}&limit=${limit}`,
        {
          userId: userInfo.id,
        }
      );

      if (response.success) {
        toast.success(response.message);
        setOrders(response.orders);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
        console.log(">>>>> Order response: ", response);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchOrder(selectedPage);
  };

  const handleTrackOrderClick = () => {
    fetchOrder(currentPage);
  };

  useEffect(() => {
    fetchOrder();
  }, [userInfo]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY "} text2={"ORDERS"} />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center border-b-2 p-4 sm:p-6 md:p-8 my-4 border-gray-300 pb-2 mb-4 text-sm font-bold text-gray-700 ">
        <p>Product</p>
        <p>Customer</p>
        <p>Payment Info</p>
        <p>Total</p>
        <p>Status</p>
      </div>

      {/* Table Rows */}
      <div>
        {orders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start border border-gray-200 p-4 sm:p-6 md:p-8 my-4 text-xs sm:text-sm text-gray-700 shadow-sm rounded-lg"
            key={index}
          >
            {/* Thông tin sản phẩm */}
            <div className="col-span-1 sm:col-span-1 ">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-2">
                  <p className="font-medium">{item.product.name}</p>
                  {Object.entries(item.sizes).map(
                    ([size, quantity], sizeIndex) => (
                      <p key={sizeIndex} className="text-gray-500 text-xs">
                        Size: {size} x {quantity}
                      </p>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Thông tin khách hàng */}
            <div>
              <p className="font-medium">Customer: {order.displayName}</p>
              <div className="text-gray-500 text-sm">
                <p>{order.address.stress},</p>
                <p>
                  {order.address.city}, {order.address.district},{" "}
                  {order.address.ward}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div>
              <p className="text-sm">Items: {order.items.length}</p>
              <p className="text-sm mt-1">Method: {order.paymentMethod}</p>
              <p className="text-sm">
                Payment: {order.payment ? "Done" : "Pending"}
              </p>
              <p className="text-sm">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Tổng tiền */}
            <div className="font-bold text-gray-800 text-sm sm:text-base">
              {currency} {order.amount}
            </div>

            {/*Order Status */}
            <div className="flex flex-col justify-between items-start lg:items-center gap-2">
              <div className="flex items-center gap-2">
                {/* Vòng tròn trạng thái */}
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <p className="text-sm md:text-base font-medium">
                  {order.status}
                </p>
              </div>
              {/* Nút Track Order */}
              <button
                onClick={handleTrackOrderClick}
                className="border border-gray-300 px-3 py-1 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-100 transition"
              >
                Track Order
              </button>
            </div>
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

export default Orders;
