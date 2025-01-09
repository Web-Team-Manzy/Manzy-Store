import React, { useContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateQuantity } from "../redux/action/cartAction";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";

const Cart = () => {
  const { currency } = useContext(ShopContext);
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart?.cartData || []);
  const { navigate } = useContext(ShopContext);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchCart());
  }, [account, dispatch]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const processedCartData = useMemo(() => {
    return cartData.flatMap((item) =>
      Object.entries(item.sizes).map(([size, quantity]) => ({
        ...item,
        size,
        quantity,
      }))
    );
  }, [cartData]);

  // const handleDelete = async (productId, size) => {
  //   dispatch(updateQuantity(productId, size, quantity));
  //   window.location.reload();
  // };

  const handleUpdateQuantity = async (productId, size, quantity) => {
    dispatch(updateQuantity(productId, size, quantity));
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR "} text2={"CART"} />
      </div>

      <div>
        {processedCartData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
          >
            <div className="flex items-start gap-6">
              <img
                src={item.product.images[0]}
                alt="product"
                className="w-16 sm:w-20"
              />

              <div>
                <p className="text-xs sm:text-lg font-medium">
                  {item.product.name}
                </p>

                <div className="flex items-center gap-5 mt-2">
                  <p>
                    {currency}
                    {item.product.price}
                  </p>
                  <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                    Size: {item.size}
                  </p>
                </div>
              </div>
            </div>

            <input
              onChange={(e) =>
                handleUpdateQuantity(
                  item.product._id,
                  item.size,
                  Number(e.target.value)
                )
              }
              type="number"
              min={1}
              defaultValue={item.quantity}
              className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
            />
            <img
              src={assets.bin_icon}
              alt="delete"
              className="w-4 mr-4 sm:w-5 cursor-pointer"
              onClick={() =>
                handleUpdateQuantity(item.product._id, item.size, 0)
              }
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
        </div>
      </div>

      <div className="w-full text-end">
        <button
          onClick={() => navigate("/place-order")}
          className="bg-black text-white text-sm my-8 px-8 py-3"
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;
