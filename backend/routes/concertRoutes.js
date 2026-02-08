const express = require("express");
const multer = require("multer");
const Concert = require("../models/Concert");
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
  const concerts = await Concert.find();
  res.send(concerts);
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const concertData = { ...req.body };
    if (req.file) {
      concertData.image = req.file.path;
    }
    const concert = new Concert(concertData);
    await concert.save();
    res.send(concert);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const concertData = { ...req.body };
    if (req.file) {
      concertData.image = req.file.path;
    }
    const concert = await Concert.findByIdAndUpdate(
      req.params.id,
      concertData,
      { new: true }
    );
    if (!concert) {
      return res.status(404).send({ error: "Concert not found" });
    }
    res.send(concert);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const concert = await Concert.findByIdAndDelete(req.params.id);
    if (!concert) {
      return res.status(404).send({ error: "Concert not found" });
    }
    res.send({ message: "Concert deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
