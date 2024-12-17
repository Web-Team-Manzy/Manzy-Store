import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";
import store from "./redux/store.js";

import "./index.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <ShopContextProvider>
                <App />
            </ShopContextProvider>
        </BrowserRouter>
    </Provider>
);
