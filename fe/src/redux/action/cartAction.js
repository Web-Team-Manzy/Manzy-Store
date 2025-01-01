// actions/cartActions.js
import { getCart, updateCart } from "../../service/callAPI";

export const SET_CART = "SET_CART";
export const setCart = (cartData) => ({
  type: "SET_CART",
  payload: cartData,
});

export const fetchCart = () => async (dispatch) => {
  try {
    const response = await getCart();
    if (response.success) {
      dispatch(setCart(response.cartData));
    } else {
      console.error("Failed to fetch cart data.");
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};

export const updateCart1 = (productId, size) => async (dispatch) => {
  try {
    const response = await updateCart(productId, size);
    if (response.success) {
      dispatch(setCart([]));
    } else {
      console.error("Failed to fetch cart data.");
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
};
