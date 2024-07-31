const express = require("express");
const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "We are up and running" });
});

module.exports = router;
