import React, { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    phone: "0123456789",
    password: "********",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    setIsEditing(false);
    // Logic lưu dữ liệu
    console.log("Saved data:", formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset lại dữ liệu (nếu cần)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
          Profile
        </h1>

        <div className="space-y-4">
          {["name", "phone", "password"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 capitalize">
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                disabled={!isEditing}
                onChange={handleInputChange}
                className={`w-full mt-1 p-2 border ${
                  isEditing ? "border-gray-300" : "border-transparent"
                } rounded-md bg-gray-${
                  isEditing ? "50" : "100"
                } focus:outline-none`}
              />
            </div>
          ))}
        </div>

        {isEditing ? (
          <div className="flex justify-between mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center mt-6">
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Change
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
