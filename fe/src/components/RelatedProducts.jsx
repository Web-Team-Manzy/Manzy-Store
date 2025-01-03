import React from "react";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { getRelatedProducts } from "../service/callAPI";
import { useParams } from "react-router-dom";

const RelatedProducts = () => {
  const [related, setRelated] = useState([]);
  const { productId } = useParams();

  const fetGetRelatedProducts = async (productId) => {
    try {
      const response = await getRelatedProducts(productId);
      console.log(response);
      setRelated(response.relatedProducts);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetGetRelatedProducts(productId);
  }, [productId]);

  return (
    <div className="mt-24">
      <div className=" text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
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

export default RelatedProducts;
