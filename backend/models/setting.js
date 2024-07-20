const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
