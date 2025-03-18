const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../actions/user.action");
const {
  getImage,
  generateImage,
  deleteImage,
  getAllBgImage,
} = require("../actions/image.action");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getImage", authenticateToken, getImage);
router.get("/getAllBgImage", getAllBgImage);
router.post(
  "/generateImage",
  authenticateToken,
  upload.single("file"),
  generateImage
);
router.post("/deleteImage", authenticateToken, deleteImage);

module.exports = router;
