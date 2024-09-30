const Controler = require("../models/controler.model.js");
const asyncHandler = require("express-async-handler");
const Image = require("../models/image.model.js");
const { uploadToS3 } = require("../utils/s3ImageUpload.js");
const { uid } = require("uid");

const createControler = asyncHandler(async (req, res) => {
  try {
    // const { controler, imageId } = req.data;
    const { email } = req.user;
    let photo;
    const jsonData = JSON.parse(req.body.data);
    if (req?.file?.buffer) {
      const filename = `${uid(16)}.png`;
      const s3Resp = await uploadToS3({
        file: req.file.buffer,
        filePath: `my-downloads/${filename}`,
      });
      if (s3Resp.Key || s3Resp.key) {
        photo = {
          downloadedImageKey: s3Resp.Key || s3Resp.key,
          bucket: s3Resp.Bucket,
        };
      }
    }
    const _controler = await Controler.create({
      email,
      ...jsonData,
      ...photo,
    });

    res.status(200).json(_controler);
  } catch (error) {
    res.status(500).json(error);
  }
});

const getContoler = asyncHandler(async (req, res) => {
  if (!req?.user?.email)
    res.status(404).json({ message: "Email id not found." });
  else {
    const controlers = await Controler.find({
      email: req.user.email,
      active: true,
    })
      .select("_id  controler imageId downloadedImageKey")
      .populate({
        path: "imageId",
        model: Image,
        select: "imageKey bgImage email _id",
        // match: { imageKey: { $ne: null } },
      });
    res.status(200).json(controlers);
  }
});

const deleteControler = asyncHandler(async (req, res) => {
  if (!req?.user?.email)
    res.status(404).json({ message: "Email id not found." });
  else {
    console.log(req.body, "deleteImage");
    const controler = await Controler.findByIdAndUpdate(
      req.body.id,
      { $set: { active: false } },
      { new: true, runValidators: true }
    );
    res.status(200).json(controler);
  }
});

module.exports.createControler = createControler;
module.exports.getContoler = getContoler;
module.exports.deleteControler = deleteControler;
