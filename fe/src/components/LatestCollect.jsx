import React from "react";
import Title from "./Title";
import { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import { lastProduct } from "../service/callAPI";

const LatestCollect = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await lastProduct();
        console.log(response);
        setLatestProducts(response.products);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST "} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Introducing our latest products
        </p>
      </div>

      {/* Rendering products here */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.images}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollect;
