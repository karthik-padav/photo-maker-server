const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../actions/user.action");
const {
  createControler,
  getContoler,
  deleteControler,
} = require("../actions/controler.action");
const multer = require("multer");
const upload = multer();

router.post(
  "/createControler",
  upload.single("file"),
  authenticateToken,
  createControler
);
router.post("/deleteControler", authenticateToken, deleteControler);
router.get("/getControler", authenticateToken, getContoler);

module.exports = router;
