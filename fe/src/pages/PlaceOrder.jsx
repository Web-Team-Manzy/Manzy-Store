import React, { useState, useContext } from "react";
import Title from "../components/Title";
import Modal from "../components/Modal";
import CartTotal from "../components/CartTotal";
import { useSelector } from "react-redux";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { requireOrderConfirmationPin, confirmEmail } from "../service/callAPI";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);
  const cartData = useSelector((state) => state.cart?.cartData || []);
  const userInfo = useSelector((state) => state.account.userInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Khóa chuyển đổi phương thức thanh toán

  const [formData, setFormData] = useState({
    city: "",
    district: "",
    ward: "",
    stress: "",
    paymentMethod: "COD",
  });

  const [verificationCode, setVerificationCode] = useState(""); // Mã xác nhận

  const handlePaymentMethodChange = (method) => {
    if (isLocked) return; // Nếu đã khóa, không cho phép thay đổi
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: method,
    }));
  };

  const getCartAmount = () => {
    let total = 0;
    cartData.forEach((item) => {
      Object.entries(item.sizes).forEach(([size, quantity]) => {
        total += item.product.price * quantity;
      });
    });
    return total;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (formData.paymentMethod === "BANKING") {
      setIsLocked(true);
      return;
    }

    const { city, district, ward, stress, paymentMethod } = formData;
    const address = { city, district, ward, stress };
    const items = cartData;
    const amount = getCartAmount();

    const orderData = {
      userId: userInfo.id,
      items,
      amount,
      address,
      paymentMethod,
    };

    const response = await axios.post(
      "http://localhost:8080/order/place",
      orderData,
      { withCredentials: true }
    );

    if (response.data.success) {
      toast.success("Please select a size");
      navigate("/orders");
    } else {
      toast.error("Failed to place order. Please try again.");
    }
  };

  // Yêu cầu mã xác nhận
  const requestVerificationCode = async () => {
    await requireOrderConfirmationPin();
  };

  const handleVerifyCode = async () => {
    try {
      const { city, district, ward, stress, paymentMethod } = formData;
      const address = { city, district, ward, stress };
      const amount = getCartAmount();
      const items = cartData;

      const response = await confirmEmail(
        verificationCode, // Mã xác nhận
        items, // Danh sách sản phẩm trong giỏ hàng
        amount, // Tổng tiền
        address, // Địa chỉ giao hàng
        paymentMethod // Phương thức thanh toán
      );

      console.log(response);

      if (response.success) {
        toast.success("Payment confirmed successfully!");
        navigate("/orders");
      } else {
        toast.error("Invalid verification code!");
      }
    } catch (error) {
      toast.error("An error occurred while verifying the payment!");
    }
  };

  const handleCancel = () => {
    setIsLocked(false); // Mở khóa phương thức thanh toán
    setFormData((prevData) => ({
      ...prevData,
      paymentMethod: "COD",
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* left */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            name="city"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            name="district"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Ward"
          value={formData.ward}
          onChange={handleChange}
          name="ward"
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Stress"
          value={formData.stress}
          onChange={handleChange}
          name="stress"
        />
      </div>

      {/* right */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT "} text2={"CART"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => handlePaymentMethodChange("BANKING")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                isLocked && formData.paymentMethod !== "BANKING"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  formData.paymentMethod === "BANKING" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">BANKING</p>
            </div>
            <div
              onClick={() => handlePaymentMethodChange("COD")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                isLocked ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  formData.paymentMethod === "COD" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            {isLocked ? (
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-8 py-3 text-sm"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    setIsModalVisible(true);
                    requestVerificationCode();
                  }}
                  className="bg-green-500 text-white px-8 py-3 text-sm"
                >
                  VERIFY PAYMENT
                </button>
              </div>
            ) : (
              <button
                onClick={handlePlaceOrder}
                className="bg-black text-white px-16 py-3 text-sm"
              >
                CONFIRM ORDER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleVerifyCode}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
      />
    </div>
  );
};

export default PlaceOrder;
