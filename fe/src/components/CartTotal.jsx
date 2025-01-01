import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { useSelector } from "react-redux";

const CartTotal = () => {
  const { delivery_fee, currency } = useContext(ShopContext);
  const cartData = useSelector((state) => state.cart?.cartData || []);

  // Tính tổng tiền từ dữ liệu đã xử lý
  const getCartAmount = () => {
    let total = 0;

    cartData.forEach((item) => {
      Object.entries(item.sizes).forEach(([size, quantity]) => {
        total += item.product.price * quantity;
      });
    });

    return total;
  };

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART "} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {getCartAmount().toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee.toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {currency} {(getCartAmount() + delivery_fee).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
