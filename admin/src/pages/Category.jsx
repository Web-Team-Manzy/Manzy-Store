import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Category = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const categorySubCategoryMap = {
    Accessories: ["Watches", "Belts", "Hats"],
    Bags: ["Handbags", "Backpacks", "Travel Bags"],
    Pants: ["Jeans", "Shorts", "Trousers"],
    Shirt: ["Casual", "Formal", "T-Shirts"],
    Shoes: ["Sneakers", "Sports", "Boots"],
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/category/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const validCategories = Object.keys(categorySubCategoryMap);
      const categoryData = response.data.data.filter((cat) =>
        validCategories.includes(cat.name)
      );
      const subCategoryData = response.data.data.filter(
        (cat) => !validCategories.includes(cat.name)
      );

      // Lưu dữ liệu vào state
      setCategories(categoryData);
      setSubCategories(subCategoryData);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        backendUrl + "/category/update",
        { categoryId: editingCategory._id, ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleEdit = async (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <p className="mb-2">Categories</p>
      <div className="flex flex-col gap-2 ">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-5 items-center py-1 px-2 border bg-gray-100 text-sm font-bold">
          <b>Name</b>
          <b>Description</b>
          <b>CreatedAt</b>
          <b>UpdatedAt</b>
          <b className="text-center">Action</b>
        </div>

        {/* Category List */}
        <p className="mb-2">Category</p>
        {categories.map((item, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.createdAt}</p>
            <p>{item.updatedAt}</p>
            <div className="flex justify-between md:justify-center gap-3">
              <p
                onClick={() => handleEdit(item)}
                className="text-right md:text-center cursor-pointer text-lg text-amber-300 hover:underline"
              >
                🔨
              </p>
            </div>
          </div>
        ))}

        {/* SubCategory List */}
        <p className="mb-2 ">SubCategory</p>
        {subCategories.map((item, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.createdAt}</p>
            <p>{item.updatedAt}</p>
            <div className="flex justify-between md:justify-center gap-3">
              <p
                onClick={() => handleEdit(item)}
                className="text-right md:text-center cursor-pointer text-lg text-amber-300 hover:underline"
              >
                🔨
              </p>
            </div>
          </div>
        ))}
      </div>
      Edit Category Form
      {editingCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <div className="flex flex-col gap-3">
              <label>Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Category Name"
                className="border px-3 py-2 rounded"
              />
              <label>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                className="border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingCategory(null)}
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
    </>
  );
};

Category.propTypes = {
  token: PropTypes.string.isRequired,
};
export default Category;
