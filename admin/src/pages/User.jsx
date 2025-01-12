/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import axios from "../customize/axios";
import { toast } from "react-toastify";
import useAuthStore from "../stores/authStore";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";

const User = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const updatedUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    firstName: "",
    lastName: "",
    role: "",
    displayName: "",
  });

  const fetchUsers = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(`/users?page=${page}&limit=${limit}`);

      if (response.EC === 0) {
        setUsers(response.DT.users);
        setTotalPages(response.DT.totalPages);
        setCurrentPage(page);
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // + 1 because react-paginate starts from 0
    fetchUsers(selectedPage);
  };

  const removeUser = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      const response = await axios.delete("/users/" + id);

      if (response.EC === 0) {
        toast.success(response.EM);
        fetchUsers();
      } else {
        toast.error(response.EM);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      phone: user.phone,
      address: user.address,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/users/" + editingUser._id, formData);

      if (response.EC === 0) {
        toast.success(response.EM);

        if (response.DT.role === "admin") {
          console.log(">>>> user: ", user);
          updatedUser({ displayName: response.DT.displayName });
        }

        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error(response.EM + " need email, display name and role");
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
      <p className="mb-2">Management User</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_2fr_1fr_2fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm font-bold">
          <b>First Name</b>
          <b>Last Name</b>
          <b>Display Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Address</b>
          <b>Phone</b>
          <b className="text-center">Action</b>
        </div>

        {/* User List */}
        {users.map((item, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_2fr_1fr_2fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.firstName}</p>
            <p>{item.lastName}</p>
            <p>{item.displayName}</p>
            <p>{item.email}</p>
            <p>{item.role}</p>
            <p>{item.address}</p>
            <p>{item.phone}</p>
            <div className="flex justify-between md:justify-center gap-3">
              <p
                onClick={() => handleEdit(item)}
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

      {/* Edit User Form */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Display Name"
                className="border px-3 py-2 rounded"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="First Name"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Last Name"
                className="border px-3 py-2 rounded"
              />
              {/* <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="Role"
                className="border px-3 py-2 rounded"
              /> */}

              <select
                className="p-2 font-semibold"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ReactPaginate
        className="flex justify-center my-5 gap-3"
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages} // Số lượng trang
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"} // Lớp CSS cho container
        activeClassName={"active px-3"} // Lớp CSS cho trang hiện tại
      />
    </>
  );
};
User.propTypes = {
  token: PropTypes.string.isRequired,
};
export default User;
