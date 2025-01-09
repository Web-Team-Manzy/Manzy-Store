import React, { useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductItem = ({ id, name, image, price }) => {
  const { currency } = useContext(ShopContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 30; // Giới hạn số ký tự

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Link
      className="text-gray-700 cursor-pointer flex flex-col items-center border p-4 h-[400px]"
      to={`/product/${id}`}
    >
      {/* Hình ảnh */}
      <div className="overflow-hidden mb-4 w-full h-[250px]">
        <img
          className="w-full h-full object-cover hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>

      {/* Tên sản phẩm */}
      <div className="flex-1 text-center">
        {isExpanded ? (
          <p className="text-sm">
            {name}{" "}
            <span
              onClick={(e) => {
                e.preventDefault(); // Ngăn Link được kích hoạt khi nhấn "Thu gọn"
                toggleExpand();
              }}
              className="text-blue-500 cursor-pointer"
            >
              Thu gọn
            </span>
          </p>
        ) : (
          <p className="text-sm">
            {name.length > maxLength ? (
              <>
                {name.slice(0, maxLength)}...
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpand();
                  }}
                  className="text-blue-500 cursor-pointer"
                >
                  Xem thêm
                </span>
              </>
            ) : (
              name
            )}
          </p>
        )}
      </div>

      {/* Giá sản phẩm */}
      <p className="text-sm font-medium mt-2">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
