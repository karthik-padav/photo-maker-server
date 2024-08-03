const Image = require("../models/image.model.js");
const asyncHandler = require("express-async-handler");

const { default: axios } = require("axios");
const { uploadToS3 } = require("../utils/s3ImageUpload");
const { uid } = require("uid");

const importDynamic = new Function("modulePath", "return import(modulePath)");

const generateImage = asyncHandler(async (req, res) => {
  try {
    let client;
    try {
      ({ client } = await importDynamic("@gradio/client"));
    } catch (error) {
      console.error("Error loading module:", error);
      res.status(500).json(error);
      return;
    }
    // const HF_TOKEN = process.env.HF_TOKEN;
    // const app = await client(process.env.HUGGING_FACE_SPACE_URL, {
    //   hf_token: HF_TOKEN,
    // });
    // const result = await app.predict("/predict", [req.file.buffer]);

    // const imgURL = `${process.env.HUGGING_FACE_SPACE_URL}file=${result?.data?.[0]?.path}`;

    // const bgRmImg = await axios.get(imgURL, {
    //   headers: { Authorization: `Bearer ${HF_TOKEN}` },
    //   responseType: "arraybuffer",
    // });

    // const filename = `${uid(16)}.png`;
    // const s3Resp = await uploadToS3({
    //   file: bgRmImg.data,
    //   filePath: filename,
    // });

    // const imageDetails = await Image.create({
    //   email: req.user.email,
    //   imageURL: s3Resp.Location,
    // });

    res.status(200).json({ imageDetails: "" });
  } catch (error) {
    res.status(500).json(error);
  }
});

const getImage = asyncHandler(async (req, res) => {
  if (!req?.user?.email)
    res.status(404).json({ message: "Email id not found." });
  else {
    const images = await Image.find({ email: req.user.email });
    res.status(200).json(images);
  }
});

module.exports.getImage = getImage;
module.exports.generateImage = generateImage;
