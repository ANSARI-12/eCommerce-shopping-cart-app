const express = require("express");
const multer = require("multer");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

const router = express.Router();

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.get("/", async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Only admins can add items");
  }
  try {
    const itemData = { ...req.body };
    if (req.file) {
      itemData.image = req.file.filename;
    } else if (req.body.existingImage) {
      itemData.image = req.body.existingImage;
    }
    const item = new Item(itemData);
    await item.save();
    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const itemData = { ...req.body };
    if (req.file) {
      itemData.image = req.file.path;
    }
    const item = await Item.findByIdAndUpdate(req.params.id, itemData, {
      new: true,
    });
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.send(item);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Only admins can delete items");
  }
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    res.send({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
