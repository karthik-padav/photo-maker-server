const express = require("express");
const router = express.Router();
const { authenticateToken, getUser } = require("../actions/user.action");

router.get("/getUser", authenticateToken, getUser);
// router.post(
//   "/updateUser",
//   authenticateToken,
//   generateImage
// );
// router.post("/deleteImage", authenticateToken, deleteImage);

module.exports = router;
