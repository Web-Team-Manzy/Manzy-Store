import React from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSelector } from "react-redux";
import axios from "axios";
  


const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);
  const cartData = useSelector((state) => state.cart?.cartData || []);
  const userInfo = useSelector((state) => state.account.userInfo);

  const [formData, setFormData] = useState({
    city: "",
    district: "",
    ward: "",
    stress: "",
    paymentMethod: "COD",
  });

  const handlePaymentMethodChange = (method) => {
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

  const handlePlaceOrder = () => {
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

    console.log(">>>> Order Data: ", orderData);
    
    // Call API to place order
    const response = axios.post("http://localhost:8080/order/place", orderData, {withCredentials: true});
    
    console.log(">>>> response: ", response);

    if(response.data.success){
      navigate("/orders");
    }

  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* left------------------------------------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        </div>

        {/* <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
            value=""
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
            value=""
          />
        </div> */}
        {/* <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
          value=""
        /> */}
        {/* <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
          value=""
        /> */}
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

      {/* right------------------------------------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT "} text2={"CART"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => handlePaymentMethodChange("PAYMENT")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  formData.paymentMethod === "PAYMENT" ? "bg-green-400" : ""
                }`}
              ></p>

              <p className="text-gray-500 text-sm font-medium mx-4">PAYMENT</p>
              
            </div>
            <div
              onClick={() => handlePaymentMethodChange("COD")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`w-3.5 h-3.5 border rounded-full ${
                  formData.paymentMethod === "COD" ? "bg-green-400" : ""
                }`}
              ></p>

              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
              
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={() => {handlePlaceOrder();}}
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
