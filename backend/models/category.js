const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  categoryName: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: { type: [Object] },
});

module.exports = mongoose.model("Category", categorySchema);
