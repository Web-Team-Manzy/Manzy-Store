import { assets } from "../assets/assets"; // Đảm bảo assets chứa logo

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <img
        src={assets.logo} // Thay assets.logo bằng đường dẫn chính xác của logo
        alt="Logo"
        className="w-40 h-40 mb-6"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Welcome to Manzy Store Admin Panel
      </h1>
      <p className="text-gray-600 max-w-md">
        Manage your products, orders, users, and more efficiently with our admin
        tools.
      </p>
    </div>
  );
};

export default HomePage;
