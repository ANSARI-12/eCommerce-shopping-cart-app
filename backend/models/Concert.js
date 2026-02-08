const mongoose = require("mongoose");

const concertSchema = new mongoose.Schema({
  name: String,
  artist: String,
  date: Date,
  venue: String,
  price: Number,
  image: String,
  description: String,
});

module.exports = mongoose.model("Concert", concertSchema);
