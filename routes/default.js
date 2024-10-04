const express = require("express");
const router = express.Router();
const axios = require("axios");

router.route("/").get(async (req, res) => {
  const SPACE_URL = "https://karthikpadav-bria-rmbg-clone.hf.space/run/predict";
  try {
    const response = await axios.get(SPACE_URL);
    console.log(`Ping successful! Status code: ${response.status}`);
  } catch (error) {
    console.error(
      `Error pinging the Hugging Face Space: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
  res.status(200).json({ message: "We are up and running" });
});

module.exports = router;
