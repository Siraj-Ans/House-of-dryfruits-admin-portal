const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, requied: true },
  dateAndTime: { type: Date, required: true },
});

module.exports = mongoose.model("Admin", adminSchema);
