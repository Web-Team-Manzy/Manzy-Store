import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { getProducts } from "../service/callAPI";

const Collection = () => {
  const { search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavant");
  const [currentPage, setCurrentPage] = useState(1);

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
    } else {
      setCategory(selectedCategory);
    }
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = e.target.value;
    if (subCategory.includes(selectedSubCategory)) {
      setSubCategory(subCategory.filter((sub) => sub !== selectedSubCategory));
    } else {
      setSubCategory([...subCategory, selectedSubCategory]);
    }
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const [totalPages, setTotalPages] = useState(0);

  const collectionList = async (page, category) => {
    try {
      const res = await getProducts(page, category);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
      setFilterProducts(res.products || []);
      console.log("API Response:", res);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    collectionList(currentPage, category);
  }, [currentPage, category]);

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
                    checked={subCategory.includes(subCat)}
                    onChange={handleSubCategoryChange} // Gắn sự kiện onChange
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
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavant">Sort by : Relevance</option>
            <option value="low-high">Sort by : Low to High</option>
            <option value="high-low">Sort by : High to Low</option>
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
