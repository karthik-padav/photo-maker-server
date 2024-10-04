const express = require("express");
const router = express.Router();
const axios = require("axios");

router.route("/").get(async (req, res) => {
  res.status(200).json({ message: "We are up and running" });
});

module.exports = router;
