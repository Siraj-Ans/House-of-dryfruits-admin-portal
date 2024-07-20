const mongoose = require("mongoose");

const accountDetailsSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  emailAddress: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, requied: true },
  city: { type: String, required: true },
  postalCode: { type: Number, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
});

module.exports = mongoose.model("AccountDetails", accountDetailsSchema);
