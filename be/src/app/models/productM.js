const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: Array, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Products", productSchema);
