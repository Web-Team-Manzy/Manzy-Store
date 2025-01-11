/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import axios from "../customize/axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import formatDate from "../util/formateDate";
import ReactPaginate from "react-paginate";

const Category = ({ token }) => {
  const [categories, setCategories] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subcategories: [],
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async (page = 1, limit = 5) => {
    try {
      const response = await axios.get(
        `/category/list?page=${page}&limit=${limit}`
      );

      // Lưu dữ liệu vào state
      setCategories(response.data);

      setTotalPages(response.pagination.pages);
      setCurrentPage(response.pagination.page);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSaveNewCategory = async () => {
    try {
      const response = await axios.post(`/category/add`, formData);

      if (response.success) {
        toast.success("Category added successfully!");
        fetchCategories();
        setIsAdding(false);
        setFormData({ name: "", description: "", subcategories: [] });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchCategories(selectedPage);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/category/update", {
        categoryId: editingCategory._id,
        ...formData,
      });

      if (response.success) {
        toast.success(response.message);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error(response.message);
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
      const response = await axios.delete(`/category/delete/${category._id}`);

      if (response.success) {
        toast.success(response.message);
        fetchCategories();
      } else {
        toast.error(response.message);
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
            <p>{formatDate(item.createdAt)}</p>
            <p>{formatDate(item.updatedAt)}</p>
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
