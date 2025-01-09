/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "300px": "300px", // Chiều cao hoặc chiều rộng cố định 300px
        "400px": "400px", // Chiều cao hoặc chiều rộng cố định 400px
      },
      lineClamp: {
        3: "3", // Giới hạn dòng hiển thị, dùng cho text overflow
      },
    },
  },
  plugins: [],
};
