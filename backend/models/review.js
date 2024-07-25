const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    comment: { type: String, required: true },
    stars: { type: Number, required: true },
    product: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
