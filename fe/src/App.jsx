import React, { useEffect, CSSProperties } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { doGetAccount } from "./redux/action/accountAction";

const App = () => {
  // >>> Backend Test
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.account.userInfo);
  const isLoading = useSelector((state) => state.account.isLoading);

  useEffect(() => {
    if (userInfo && !userInfo.email) {
      dispatch(doGetAccount());
    }
  }, []);

  // >>> End Backend Test

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {
        // >>> Backend Test
        isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PuffLoader color={"#000"} loading={true} size={150} />
          </div>
        )
        // >>> End Backend Test
      }
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
