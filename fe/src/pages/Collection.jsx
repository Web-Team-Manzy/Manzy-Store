import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { getProducts } from "../service/callAPI";
import { useLocation } from "react-router-dom";

const Collection = () => {
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const categorySubCategoryMap = {
    Accessories: ["Watches", "Belts", "Hats"],
    Bags: ["Handbags", "Backpacks", "Travel Bags"],
    Pants: ["Jeans", "Shorts", "Trousers"],
    Shirt: ["Casual", "Formal", "T-Shirts"],
    Shoes: ["Sneakers", "Sports", "Boots"],
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (category === selectedCategory) {
      setCategory(null);
      setSubCategory("");
    } else {
      setCategory(selectedCategory);
      setSubCategory("");
    }
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    if (subCategory === selectedSubCategory) {
      setSubCategory("");
    } else {
      setSubCategory(selectedSubCategory);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "low-high":
        setSortField("price");
        setSortOrder("asc");
        break;
      case "high-low":
        setSortField("price");
        setSortOrder("desc");
        break;
      case "dated":
        setSortField("dated");
        setSortOrder("desc");
        break;
      default:
        setSortField(null);
        setSortOrder(null);
        break;
    }
  };

  const [totalPages, setTotalPages] = useState(0);

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("search") || "";

  const collectionList = async (
    page,
    category,
    subcategory,
    find,
    field,
    type
  ) => {
    try {
      const res = await getProducts(
        page,
        category,
        subcategory,
        find,
        field,
        type
      );
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
      setFilterProducts(res.products || []);
      console.log("API Response:", res);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    console.log("subCategory:", sortField, sortOrder);
    collectionList(
      currentPage,
      category,
      subCategory,
      search,
      sortField,
      sortOrder
    );
  }, [currentPage, category, subCategory, search, sortField, sortOrder]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex item-center cursor-pointer gap-2"
        >
          FILTER
          <img
            className={`mt-2 h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
          />
        </p>

        {/* Categories */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block `}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {Object.keys(categorySubCategoryMap).map((cat) => (
              <p className="flex gap-2" key={cat}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  checked={category === cat}
                  onChange={handleCategoryChange}
                />
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategories */}
        {category && (
          <div
            className={`border border-gray-300 pl-5 py-3 mt-5 ${
              showFilter ? "" : "hidden"
            } sm:block `}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {categorySubCategoryMap[category].map((subCat) => (
                <p className="flex gap-2" key={subCat}>
                  <input
                    className="w-3"
                    type="checkbox"
                    value={subCat}
                    checked={subCategory === subCat}
                    onChange={handleSubCategoryChange}
                  />
                  {subCat}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL "} text2={"COLLECTIONS"} />
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={handleSortChange}
          >
            <option value="">Sort</option>
            <option value="low-high">Sort by : Low to High</option>
            <option value="high-low">Sort by : High to Low</option>
            <option value="dated">Sort by : New Products</option>
          </select>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              image={item.images}
              price={item.price}
            />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-6">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 border ${
                currentPage === index + 1
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
