/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import axios from "../customize/axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { currency } from "../App";
import { assets } from "../assets/assets";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editing, setEditing] = useState(false);

  const [sizes, setSizes] = useState([]);
  const [sizeType, setSizeType] = useState("letter"); // letter or number

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const sizeOptions = {
    letter: ["S", "M", "L", "XL", "XXL"],
    number: [37, 38, 39, 40, 41, 42, 43],
  };

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    bestseller: "",
    files: [],
  });

  const fetchList = async (page = 1) => {
    try {
      const response = await axios.get("/product/list", {
        params: { page, limit: 10 },
      });
      if (response.success) {
        setList(response.products);
        setTotalPages(response.totalPages);
        setCurrentPage(page);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category/list");

        if (response.success) {
          const data = response.data;
          setCategories(data);

          // Lấy subcategories từ category đầu tiên để render mặc định
          const firstCategory = data[0];
          if (firstCategory) {
            setSubCategories(firstCategory.subcategories || []);
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat._id === formData.category
    );
    if (selectedCategory) {
      setSubCategories(selectedCategory.subcategories || []);
    }
  }, [formData.category, categories]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // + 1 because react-paginate starts from 0
    fetchList(selectedPage);
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete("/product/delete", {
        params: { id },
      });

      if (response.success) {
        toast.success(response.message);
        fetchList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm ">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.images[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category?.name || "No Category"}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex flex-row gap-3 md:justify-center">
              <p
                onClick={() => setEditing(true)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                🔨
              </p>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg text-red-500"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>

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

      {/* Edit Product Modal */}
      {editing && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Name</p>
                <input
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  type="text"
                  placeholder="Product Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </p>
                <input
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  type="text"
                  placeholder="Description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Price</p>
                <input
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  type="number"
                  placeholder="Product Price"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Category
                </p>
                <select
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Sub Category
                </p>
                <select
                  className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                  required
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subCategory: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select a subcategory
                  </option>
                  {subCategories.map((subCat, index) => (
                    <option key={index} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2">Product Size Type</p>
                <div className="flex flex-row gap-3">
                  <div className="flex gap-3 mb-3">
                    <label>
                      <input
                        type="radio"
                        name="sizeType"
                        value="letter"
                        checked={sizeType === "letter"}
                        onChange={() => setSizeType("letter")}
                      />
                      <span className="ml-2">Letter Sizes</span>
                    </label>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <label>
                      <input
                        type="radio"
                        name="sizeType"
                        value="number"
                        checked={sizeType === "number"}
                        onChange={() => {
                          setSizeType("number");
                          setSizes([]);
                        }}
                      />
                      <span className="ml-2">Number Sizes</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  {sizeOptions[sizeType].map((size) => (
                    <div
                      key={size}
                      onClick={() =>
                        setSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((item) => item !== size)
                            : [...prev, size]
                        )
                      }
                    >
                      <p
                        className={`${
                          sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                        } px-3 pty-1 cursor-pointer`}
                      >
                        {size}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3 min-w-72">
                <p className="text-sm font-medium text-gray-700 mb-2">Image</p>
                <div className="flex gap-2">
                  <label htmlFor="image1">
                    <img
                      className="w-20"
                      src={
                        !image1
                          ? assets.upload_area
                          : URL.createObjectURL(image1)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage1(e.target.files[0])}
                      type="file"
                      id="image1"
                      hidden
                    />
                  </label>
                  <label htmlFor="image2">
                    <img
                      className="w-20"
                      src={
                        !image2
                          ? assets.upload_area
                          : URL.createObjectURL(image2)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage2(e.target.files[0])}
                      type="file"
                      id="image2"
                      hidden
                    />
                  </label>
                  <label htmlFor="image3">
                    <img
                      className="w-20"
                      src={
                        !image3
                          ? assets.upload_area
                          : URL.createObjectURL(image3)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage3(e.target.files[0])}
                      type="file"
                      id="image3"
                      hidden
                    />
                  </label>
                  <label htmlFor="image4">
                    <img
                      className="w-20"
                      src={
                        !image4
                          ? assets.upload_area
                          : URL.createObjectURL(image4)
                      }
                      alt=""
                    />
                    <input
                      onChange={(e) => setImage4(e.target.files[0])}
                      type="file"
                      id="image4"
                      hidden
                    />
                  </label>
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  className="mt-2 w-full py-2 px-4 rounded-md bg-black text-white"
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  className="mt-2 w-full py-2 px-4 rounded-md bg-black text-white"
                  type="submit"
                >
                  {" "}
                  Save{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
List.propTypes = {
  token: PropTypes.string.isRequired,
};
export default List;
