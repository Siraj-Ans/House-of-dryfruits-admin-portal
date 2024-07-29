const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emailAddress: { type: String, requied: true },
    country: { type: String, requied: true },
    phoneNumber: { type: String, requied: true },
    firstName: { type: String, requied: true },
    lastName: { type: String, requied: true },
    city: { type: String, requied: true },
    postalCode: { type: Number, requied: true },
    address1: { type: String, requied: true },
    paymentMethod: { type: String, requied: true },
    productInfo: { type: [Object], required: true },
    paid: { type: Boolean, required: true },
    fullfilled: { type: String, required: true },
    productInfo: { type: [Object], required: true },
    completed: { type: Boolean, required: true },
    trackingId: { type: String },
    address2: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
