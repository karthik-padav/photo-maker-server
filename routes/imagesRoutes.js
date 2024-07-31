const express = require("express");
const router = express.Router();
const { getImages, createImages } = require("../controllers/imageController");

router.route("/").get(getImages).post(createImages);

module.exports = router;
