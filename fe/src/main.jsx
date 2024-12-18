import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import ShopContextProvider from "./context/ShopContext.jsx";
import store from "./redux/store.js";

import "./index.css";

document.head.innerHTML += `<meta name="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">`;
document.head.innerHTML += `<meta name="Cross-Origin-Embedder-Policy" content="require-corp">`;

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_CLIENT_ID}`}>
        <Provider store={store}>
            <BrowserRouter>
                <ShopContextProvider>
                    <App />
                </ShopContextProvider>
            </BrowserRouter>
        </Provider>
    </GoogleOAuthProvider>
);
