import { assets } from "../assets/assets";
import axios from "axios";


const doLogout = async () => {
  const response = await axios
    .get("http://localhost:8080/account", {
      withCredentials: true,
    });
  const res = response.data;
  if(res && +res.EC === 0) {
    await axios
      .post("http://localhost:8080/logout", {
        email: res?.DT?.user?.email || ""}, 
        {
          withCredentials: true,
        })
      .then((response) => {
        console.log(">>> response: ", response);
      })
      .catch((error) => {
        console.log(">>> error: ", error);
      });
  }
}

const Navbar = ({ setToken }) => {
  
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="logo" />
      <button
        onClick={() => {doLogout(); setToken("")}}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
