const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    pin: { type: String, required: true },
    purpose: { type: String, required: true }, // Purpose of the PIN (e.g., "order_confirmation", "email_verification")
    expirationTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pins", pinSchema);