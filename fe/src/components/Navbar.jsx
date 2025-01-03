import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { doLogout } from "../redux/action/accountAction";
import { fetchCart } from "../redux/action/cartAction";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const totalItems = useSelector((state) => state.cart?.totalItems || 0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      navigate(`/collection?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // >>> Backend Test
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.account.userInfo);

  const handleLogout = () => {
    dispatch(doLogout(userInfo.email));
  };
  // >>> End Backend Test

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-32 h-18" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="relative w-64 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <img
          src={assets.search_icon}
          alt="search"
          className="absolute top-1/2 right-3 w-5 h-5 -translate-y-1/2 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* <div className="relative w-64 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <img
          src={assets.search_icon}
          alt="search"
          className="absolute top-1/2 right-3 w-5 h-5 -translate-y-1/2 cursor-pointer"
        />
      </div> */}
      <div className="flex items-center gap-6 relative">
        <div className="group relative">
          {
            // >>> Backend Test
            userInfo && userInfo.email ? (
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-5 cursor-pointer"
              />
            ) : (
              <Link to="/login">
                <img
                  src={assets.profile_icon}
                  alt="profile"
                  className="w-5 cursor-pointer"
                />
              </Link>
            )
            // >>> End Backend Test
          }
          {
            // >>> Backend Test
            userInfo && userInfo.email && (
              <div className="group-hover:block hidden absolute drop-menu right-0 pt-4 ">
                <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500 rounded">
                  <Link to="/profile">
                    <p className="cursor-pointer hover:text-black">
                      My Profile
                    </p>
                  </Link>
                  <Link to="/orders">
                    <p className="cursor-pointer hover:text-black">Orders</p>
                  </Link>
                  <p
                    className="cursor-pointer hover:text-black"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </p>
                </div>
              </div>
            )
          }
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="cart" className="w-5 min-w-5" />

          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {totalItems}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt=""
          className="w-5 cursor-poiter sm:hidden"
        />
      </div>

      {/* Siderbar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3"
          >
            <img
              src={assets.dropdown_icon}
              alt="close"
              className="h-4 rotate-180"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
