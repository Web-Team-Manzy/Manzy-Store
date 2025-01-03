import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const Category = ({ token }) => {
  const [categories, setCategories] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subcategories: [],
  });

  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/category/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Lưu dữ liệu vào state
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleSaveNewCategory = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/category/add`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Category added successfully!");
        fetchCategories();
        setIsAdding(false);
        setFormData({ name: "", description: "", subcategories: [] });
      } else {
        toast.error(response.data.message);
      }
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
      subcategories: category.subcategories || [],
    });
  };

  const handleDelete = async (category) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/category/delete/${category._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCategories();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <p className="mb-2">Categories</p>
      <button
        onClick={() => {
          setFormData({ name: "", description: "", subcategories: [] });
          setIsAdding(true);
        }}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        +
      </button>
      <div className="flex flex-col gap-2 ">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-6 items-center py-1 px-2 border bg-gray-100 text-sm font-bold">
          <b>Name</b>
          <b>SubCategory</b>
          <b>Description</b>
          <b>CreatedAt</b>
          <b>UpdatedAt</b>
          <b className="text-center">Action</b>
        </div>

        {/* Category List */}
        {categories.map((item, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-6 items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <p>{item.name}</p>
            <p>
              {Array.isArray(item.subcategories)
                ? item.subcategories.join(", ")
                : item.subcategories}
            </p>
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
              <p
                onClick={() => handleDelete(item)}
                className="text-right md:text-center cursor-pointer text-lg text-red-500 hover:underline"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Category Form */}
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
              <label>Subcategories</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.subcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded"
                  >
                    <span>{subcategory}</span>
                    <button
                      onClick={() => {
                        const updatedSubcategories =
                          formData.subcategories.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          subcategories: updatedSubcategories,
                        });
                      }}
                      className="text-red-500 font-bold"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a subcategory and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const newSubcategory = e.target.value.trim();
                    if (
                      newSubcategory &&
                      !formData.subcategories.includes(newSubcategory)
                    ) {
                      setFormData({
                        ...formData,
                        subcategories: [
                          ...formData.subcategories,
                          newSubcategory,
                        ],
                      });
                      e.target.value = ""; // Clear input after adding
                    }
                  }
                }}
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
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
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
              <label>Subcategories</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.subcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded"
                  >
                    <span>{subcategory}</span>
                    <button
                      onClick={() => {
                        const updatedSubcategories =
                          formData.subcategories.filter((_, i) => i !== index);
                        setFormData({
                          ...formData,
                          subcategories: updatedSubcategories,
                        });
                      }}
                      className="text-red-500 font-bold"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type a subcategory and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const newSubcategory = e.target.value.trim();
                    if (
                      newSubcategory &&
                      !formData.subcategories.includes(newSubcategory)
                    ) {
                      setFormData({
                        ...formData,
                        subcategories: [
                          ...formData.subcategories,
                          newSubcategory,
                        ],
                      });
                      e.target.value = ""; // Clear input after adding
                    }
                  }
                }}
                className="border px-3 py-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewCategory}
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
