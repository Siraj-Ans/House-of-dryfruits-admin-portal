const mongoose = require("mongoose");

const contaactUsSchema = mongoose.Schema({
  userName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model("ContactUs", contaactUsSchema);
