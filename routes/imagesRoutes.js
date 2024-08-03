const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../actions/user.action");
const { getImage, generateImage } = require("../actions/image.action");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getImage", authenticateToken, getImage);
router.post(
  "/generateImage",
  authenticateToken,
  upload.single("file"),
  generateImage
);

module.exports = router;
