import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const Header = () => {
  // Tạo state để lưu ảnh hiện tại
  const [currentImage, setCurrentImage] = useState(0); // 0: menu1, 1: menu2, 2: menu3

  // Danh sách các ảnh
  const images = [assets.menu1, assets.menu2, assets.menu3];

  // Hàm xử lý click vào nửa trái hoặc phải
  const handleImageClick = (direction) => {
    if (direction === "left") {
      setCurrentImage(
        currentImage === 0 ? images.length - 1 : currentImage - 1
      );
    } else {
      setCurrentImage(
        currentImage === images.length - 1 ? 0 : currentImage + 1
      );
    }
  };

  // useEffect để tự động đổi ảnh sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) =>
        prevImage === images.length - 1 ? 0 : prevImage + 1
      );
    }, 3000); // 3 giây

    // Cleanup interval khi component bị hủy
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative z-10">
      {/* Header right with image */}
      <div className=" z-10 w-full h-[60vh] sm:h-[80vh] relative mt-[60px] sm:mt-0">
        {/* Ảnh hiện tại */}
        <img
          className="w-full h-full object-cover transition-transform duration-500"
          src={images[currentImage]}
          alt="Hero Image"
        />

        {/* Header content (Text) */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent py-10 px-6 text-center text-white">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-white" />
            <p className="font-medium text-sm md:text-base uppercase tracking-wider">
              OUR PRODUCTS ARE THE BEST
            </p>
          </div>
          <h1 className="font-prata text-4xl sm:text-5xl lg:text-6xl font-semibold py-3 leading-snug">
            Manzy Store
          </h1>
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <p className="font-semibold text-sm md:text-base">
              Best shopping for you
            </p>
            <p className="w-8 md:w-11 h-[1px] bg-white" />
          </div>
        </div>
      </div>

      {/* Nút bấm để đổi ảnh */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-transparent"
        onClick={() => handleImageClick("left")}
      ></div>
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-transparent"
        onClick={() => handleImageClick("right")}
      ></div>
    </div>
  );
};

export default Header;
