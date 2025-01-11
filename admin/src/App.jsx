import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Order";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";
import User from "./pages/User";
import Category from "./pages/Category";
import Transaction from "./pages/Transaction";
import Statistic from "./pages/Statistic";
import useAuthStore from "./stores/authStore";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const doGetAccount = useAuthStore((state) => state.doGetAccount);
  
  useEffect(() => {
    doGetAccount();
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/users" element={<User token={token} />} />
                <Route
                  path="/categories"
                  element={<Category token={token} />}
                />
                <Route
                  path="/transactions"
                  element={<Transaction token={token} />}
                />
                <Route
                  path="/statistics"
                  element={<Statistic token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
