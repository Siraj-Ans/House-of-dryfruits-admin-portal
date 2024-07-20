const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: { type: String, required: true, unique: false },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, requied: true },
});

module.exports = mongoose.model("User", userSchema);
