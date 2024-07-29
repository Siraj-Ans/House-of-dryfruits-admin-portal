const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  value: {
    type: String,
  },
});

module.exports = mongoose.model("Setting", settingSchema);
