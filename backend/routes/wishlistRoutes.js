const express = require("express");
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user's wishlist
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "items"
    );
    if (!wishlist) {
      return res.send({ items: [] });
    }
    res.send(wishlist);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add item to wishlist
router.post("/", auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [itemId] });
    } else {
      if (!wishlist.items.includes(itemId)) {
        wishlist.items.push(itemId);
      }
    }

    await wishlist.save();
    await wishlist.populate("items");
    res.send(wishlist);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Remove item from wishlist
router.delete("/:itemId", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item) => item.toString() !== req.params.itemId
      );
      await wishlist.save();
      await wishlist.populate("items");
      res.send(wishlist);
    } else {
      res.status(404).send({ error: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
