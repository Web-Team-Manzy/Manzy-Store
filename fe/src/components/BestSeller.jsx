import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { getProducts } from "../service/callAPI";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  const collectionList = async (page, category, bestseller) => {
    try {
      const res = await getProducts(
        page,
        category,
        "",
        "",
        "name",
        "acs",
        8,
        bestseller
      );
      setBestSeller(res.products || []);
      console.log("API Response:", res);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    collectionList(1, "", true);
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST "} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Introducing our best selling products
        </p>
      </div>

      {/* Rendering products here */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
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

export default BestSeller;
