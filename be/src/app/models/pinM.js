const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
  {
    email: { type: String },
    pin: { type: String, required: true },
    purpose: { type: String, required: true }, 
    expirationTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pins", pinSchema);
