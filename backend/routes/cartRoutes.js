const express = require("express");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  let cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    cart = new Cart({
      userId: req.user._id,
      items: [],
    });
  }

  cart.items.push({
    itemId: req.body.itemId,
    quantity: 1,
  });

  await cart.save();

  res.send(cart);
});

router.get("/", auth, async (req, res) => {
  const cart = await Cart.findOne({
    userId: req.user._id,
  }).populate("items.itemId");

  res.send(cart);
});

router.delete("/:itemId", auth, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(404).send("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.itemId.toString() !== req.params.itemId
  );

  await cart.save();
  res.send(cart);
});

module.exports = router;
