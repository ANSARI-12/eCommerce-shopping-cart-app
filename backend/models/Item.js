const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Item", itemSchema);
