import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const About = () => {
  // State to toggle the visibility of the "Learn More" content
  const [showMore, setShowMore] = useState(false);

  const handleLearnMore = () => {
    setShowMore(!showMore); // Toggle the visibility of the extra content
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between space-x-12">
        {/* Text Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-xl text-gray-700 mb-6">
            Welcome to our online clothing store! At our store, we believe
            that fashion should be both stylish and affordable. Whether you’re
            looking for casual wear, office attire, or a special outfit for an
            event, we have a wide variety of options to suit your needs.
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Our mission is to provide you with high-quality clothing at prices
            that won’t break the bank. We take pride in offering the latest
            trends in fashion, ensuring that you’re always ahead of the curve.
          </p>

          {/* Show more content when button is clicked */}
          {showMore && (
            <>
              <p className="text-xl text-gray-700 mb-6">
                We take pride in offering the best fabrics and materials, designed
                for comfort, durability, and style. With our easy-to-use website,
                shopping is convenient and hassle-free, allowing you to browse,
                choose, and receive your items quickly.
              </p>
              <p className="text-xl text-gray-700 mb-6">
                Our dedicated support team is always here to assist you with any
                questions or concerns. We aim to build long-lasting relationships
                with our customers, providing exceptional service and products every
                time you shop with us.
              </p>
            </>
          )}

          {/* Learn More Button */}
          <button
            onClick={handleLearnMore}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            {showMore ? "Show Less" : "Learn More"}
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 text-center">
          <img
            src="https://as1.ftcdn.net/v2/jpg/05/49/38/52/1000_F_549385228_gKCdqkhpw51dWtHIVtxRN0AynnT3kq31.jpg"
            alt="Our Store"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Social Media Icons Section */}
      <div className="flex justify-center space-x-8 mt-8">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-600"
        >
          <FaTwitter size={48} />
        </a>
        <a
          href="https://www.facebook.com/dotima71"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <FaFacebook size={48} />
        </a>
        <a
          href="https://www.instagram.com/tienmanh741/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-800"
        >
          <FaInstagram size={48} />
        </a>
      </div>
    </div>
  );
};

export default About;
