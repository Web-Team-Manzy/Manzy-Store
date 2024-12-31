import { combineReducers } from "redux";

import counterReducer from "./counterReducer";
import accountReducer from "./accountReducer";
import cartReducer from "./cartReducer";

const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer,
  cart: cartReducer,
});

export default rootReducer;
