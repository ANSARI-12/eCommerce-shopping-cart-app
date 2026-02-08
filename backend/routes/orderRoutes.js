const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const cart = await Cart.findOne({
    userId: req.user._id,
  }).populate("items.itemId");

  if (!cart || cart.items.length === 0) {
    return res.status(400).send("Cart empty");
  }

  const total = cart.items.reduce((sum, i) => {
    return sum + i.itemId.price * i.quantity;
  }, 0);

  const order = new Order({
    userId: req.user._id,
    items: cart.items,
    totalAmount: total,
  });

  await order.save();

  cart.items = [];
  await cart.save();

  res.send(order);
});

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({
    userId: req.user._id,
  }).populate("items.itemId");

  res.send(orders);
});

module.exports = router;
