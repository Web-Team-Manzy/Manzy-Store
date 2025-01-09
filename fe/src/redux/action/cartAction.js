// actions/cartActions.js
import { getCart, updateCartQuantity } from "../../service/callAPI";

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

export const updateQuantity = (itemId, size, quantity) => async (dispatch) => {
  try {
    const response = await updateCartQuantity(itemId, size, quantity);
    if (response.success) {
      dispatch(fetchCart());
    } else {
      console.error("Failed to update cart data.");
    }
  } catch (error) {
    console.error("Error updating cart data:", error);
  }
};
