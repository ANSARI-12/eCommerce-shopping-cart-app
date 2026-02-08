const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      password: hashedPass,
      role: req.body.role || "user",
    });

    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send("User already exists");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send("Invalid credentials");
  }

  if (user.token) {
    return res.status(403).send("You cannot login on another device.");
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  user.token = token;
  await user.save();

  res.send({ token });
});

router.post("/logout", auth, async (req, res) => {
  req.user.token = null;
  await req.user.save();

  res.send("Logged out successfully");
});

router.get("/profile", auth, async (req, res) => {
  res.send({ username: req.user.username, role: req.user.role });
});

module.exports = router;
