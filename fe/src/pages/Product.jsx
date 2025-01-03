/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getDetailProduct, addToCart } from "../service/callAPI";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchCart } from "../redux/action/cartAction";

const Product = () => {
  const { productId } = useParams();
  const { currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [message, setMessage] = useState(""); // Thêm state message
  const dispatch = useDispatch();

  const fetchProductData = async (productId) => {
    try {
      const response = await getDetailProduct(productId);
      setProductData(response.product);
      setImage(response.product.images[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    try {
      const response = await addToCart(productData._id, size);
      if (response.success) {
        toast.success("Product added to cart successfully!");
        dispatch(fetchCart());
      } else {
        toast.error("Failed to add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProductData(productId);
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* image section */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full cursor-pointer sm:mb-3 flex-shrink-0"
                alt={productData.name}
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt={productData.name} />
          </div>
        </div>

        {/* product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img className="w-3 5" src={assets.star_icon} alt="star" />
            <img className="w-3 5" src={assets.star_icon} alt="star" />
            <img className="w-3 5" src={assets.star_icon} alt="star" />
            <img className="w-3 5" src={assets.star_icon} alt="star" />
            <img className="w-3 5" src={assets.star_dull_icon} alt="star" />
            <p className="pl-2">(130)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description.replace(/\\r\\n/g, " ")}{" "}
            {/* Xử lý mô tả */}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border py-2 px-4 bg-gray-300 ${
                    item === size
                      ? "border-orange-500 bg-blue-100 text-red-500"
                      : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>

          {/* Display message */}
          {message && <p className="mt-4 text-lg text-green-600">{message}</p>}
        </div>
      </div>

      {/* description & review section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>

          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      {/* related products */}
      <RelatedProducts />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
