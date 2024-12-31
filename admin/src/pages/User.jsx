import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const User = ({ token }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(backendUrl + "/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.EC === 0) {
        setUsers(response.data.DT);
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      const response = await axios.delete(backendUrl + "/users/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.EC === 0) {
        toast.success(response.data.EM);
        fetchUsers();
      } else {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <p className="mb-2 font-bold text-lg">Management User</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_2fr_1fr_2fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm font-bold">
          <b>First Name</b>
          <b>Last Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Address</b>
          <b>Phone</b>
          <b className="text-center">Action</b>
        </div>

        {/* User List */}
        {users.map((item, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_1fr_2fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.firstName}</p>
            <p>{item.lastName}</p>
            <p>{item.email}</p>
            <p>{item.role}</p>
            <p>{item.address}</p>
            <p>{item.phone}</p>
            <div className="flex justify-between md:justify-center gap-3">
              <p
                onClick={() => removeUser(item._id)}
                className="text-right md:text-center cursor-pointer text-lg text-amber-300 hover:underline"
              >
                🔨
              </p>
              <p
                onClick={() => removeUser(item._id)}
                className="text-right md:text-center cursor-pointer text-lg text-red-500 hover:underline"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
User.propTypes = {
  token: PropTypes.string.isRequired,
};
export default User;
