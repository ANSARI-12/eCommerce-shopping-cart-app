const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const concertRoutes = require("./routes/concertRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("uploads"));

app.get("/api/images", (req, res) => {
  const fs = require("fs");
  const path = require("path");
  const uploadsDir = path.join(__dirname, "uploads");

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res
        .status(500)
        .send({ error: "Unable to read uploads directory" });
    }
    const images = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    res.send(images);
  });
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/concerts", concertRoutes);
app.use("/api/wishlist", wishlistRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is Running Well");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

module.exports = app;
