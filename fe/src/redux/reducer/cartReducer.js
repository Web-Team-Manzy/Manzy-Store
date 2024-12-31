// reducers/cartReducer.js
import { SET_CART } from "../action/cartAction";

const initialState = {
  cartData: [],
  totalItems: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      // eslint-disable-next-line no-case-declarations
      const totalItems = action.payload.reduce((sum, item) => {
        return (
          sum +
          Object.values(item.sizes).reduce((subSum, qty) => subSum + qty, 0)
        );
      }, 0);

      return {
        ...state,
        cartData: action.payload,
        totalItems,
      };

    default:
      return state;
  }
};

export default cartReducer;
