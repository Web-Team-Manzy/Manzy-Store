import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { useSelector, useDispatch } from "react-redux";

const CartTotal = () => {
  const { delivery_fee, currency } = useContext(ShopContext);
  const cartData = useSelector((state) => state.cart?.cartData || []);

  const getCartAmount = () => {
    let total = 0;
    cartData.forEach((item) => {
      total += item.product.price * Object.values(item.sizes)[0];
    });
    console.log(total);
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
            {currency} {getCartAmount()}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}.00{" "}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {currency}{" "}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
