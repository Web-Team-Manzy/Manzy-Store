import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../redux/action/cartAction";
import { doGetAccountBalance, doLogout } from "../redux/action/accountAction";

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

  useEffect(() => {
    if (userInfo?.id) {
      dispatch(doGetAccountBalance(userInfo.id));
    }
    dispatch(fetchCart());
  }, [userInfo?.id, userInfo.balance, dispatch]);

  // Handle scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        document.querySelector(".navbar").classList.add("navbar-scrolled");
      } else {
        document.querySelector(".navbar").classList.remove("navbar-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex items-center justify-between py-5 font-medium navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-32 h-18" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1 group">
          <p className="group-hover:text-blue-500">HOME</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 group-hover:w-full transition-all" />
        </NavLink>

        <NavLink
          to="/collection"
          className="flex flex-col items-center gap-1 group"
        >
          <p className="group-hover:text-blue-500">COLLECTION</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 group-hover:w-full transition-all" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1 group">
          <p className="group-hover:text-blue-500">ABOUT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 group-hover:w-full transition-all" />
        </NavLink>

        <NavLink
          to="/contact"
          className="flex flex-col items-center gap-1 group"
        >
          <p className="group-hover:text-blue-500">CONTACT</p>
          <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 group-hover:w-full transition-all" />
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

      <div className="flex items-center gap-6 relative">
        <div className="group relative">
          {userInfo && userInfo.email ? (
            <div className="flex items-center gap-2">
              <p className="text-gray-500 text-sm">{userInfo.balance} $</p>
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-5 cursor-pointer"
              />
            </div>
          ) : (
            <Link to="/login">
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-5 cursor-pointer"
              />
            </Link>
          )}
          {userInfo && userInfo.email && (
            <div className="group-hover:block hidden absolute drop-menu right-0 pt-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-50">
              <div className="flex flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500 rounded shadow-lg">
                <Link to="/profile">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                </Link>
                <Link to="/orders">
                  <p className="cursor-pointer hover:text-black">Orders</p>
                </Link>
                <p
                  className="cursor-pointer hover:text-black"
                  onClick={() => {
                    navigate("/");
                    handleLogout();
                  }}
                >
                  Logout
                </p>
              </div>
            </div>
          )}
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
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all transform ${
          visible
            ? "w-full opacity-100 translate-x-0"
            : "w-0 opacity-0 translate-x-full"
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
