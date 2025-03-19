const Controler = require("../models/controler.model.js");
const User = require("../models/user.model.js");
const asyncHandler = require("express-async-handler");
const Image = require("../models/image.model.js");
const { uploadToS3 } = require("../utils/s3ImageUpload.js");
const { uid } = require("uid");
const { pool } = require("../config/dbConnection.js");

const controlerFields = [
  "id",
  "userId",
  "imageId",
  "borderRadius",
  "imageWrapperSize",
  "rotate",
  "scale",
  "pngShadow",
  "transformX",
  "transformY",
  "pngBorderColor",
  "backgroundColorType",
  "backgroundColor",
  "outerBorderColor",
  "outerBorderOpacity",
  "outerBorderWidth",
  "backgroundRotate",
  "backgroundScale",
  "downloadedImagePath",
  "backgroundImagePath",
];

const createControler = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    let photo;
    const ENABLE_PAYMENT = process.env.ENABLE_PAYMENT === "true";
    const credit = process.env.PRICE_PER_DOWNLOAD
      ? parseInt(process.env.PRICE_PER_DOWNLOAD)
      : 3;
    const jsonData = JSON.parse(req.body.data);
    if (ENABLE_PAYMENT) {
      const user = await User.findById(userId);
      if (user && credit > user.credit) {
        res.status(500).json({ message: "No Credit" });
        return;
      }
    }

    if (req?.file?.buffer) {
      const filename = `${uid(16)}.png`;
      const s3Resp = await uploadToS3({
        file: req.file.buffer,
        filePath: `${process.env.S3_DIR}/my-downloads/${userId}/${filename}`,
      });
      if (s3Resp.Key || s3Resp.key) {
        photo = { downloadedImagePath: s3Resp.Key || s3Resp.key };
      }
    }

    const sql = `
    INSERT INTO Controler (${controlerFields.join(",")})
    VALUES (${Array(controlerFields.length).fill("?").join(",")})`;

    const id = uid(16);
    const mergedData = { ...jsonData, ...photo, id, userId };
    try {
      const [result] = await pool.execute(sql, [
        ...controlerFields.map((i) => mergedData[i] || null),
      ]);
      if (result.affectedRows > 0)
        res.status(200).json({ userId, ...mergedData });
      res.status(500).json({ message: "No rows affected." });
    } catch (error) {
      console.log(error, "error123");
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const getControler = asyncHandler(async (req, res) => {
  try {
    if (!req?.user?.email)
      res.status(404).json({ message: "Email id not found." });
    else {
      const [rows] = await pool.execute(
        `SELECT 
    JSON_OBJECT(
        'id', C.id,
        'downloadedImagePath', C.downloadedImagePath,
        'controler', JSON_OBJECT(
            'id', C.id,
            'userId', C.userId,
            'imageId', C.imageId,
            'borderRadius', C.borderRadius,
            'imageWrapperSize', C.imageWrapperSize,
            'rotate', C.rotate,
            'scale', C.scale,
            'pngShadow', C.pngShadow,
            'transformX', C.transformX,
            'transformY', C.transformY,
            'pngBorderColor', C.pngBorderColor,
            'backgroundColorType', C.backgroundColorType,
            'backgroundColor', C.backgroundColor,
            'outerBorderColor', C.outerBorderColor,
            'outerBorderOpacity', C.outerBorderOpacity,
            'outerBorderWidth', C.outerBorderWidth,
            'backgroundRotate', C.backgroundRotate,
            'backgroundScale', C.backgroundScale,
            'downloadedImagePath', C.downloadedImagePath,
            'backgroundImagePath', C.backgroundImagePath
        ),
        'image', JSON_OBJECT(
            'id', I.id,
            'userId', I.userId,
            'imagePath', I.imagePath
        )
            ) AS result
        FROM Controler AS C
        JOIN Image AS I ON C.imageId = I.id
        JOIN User AS U ON C.userId = U.id
        WHERE C.userId = ? 
          AND C.isActive = 1 
          AND I.isActive = 1 
          AND U.isActive = 1
        ORDER BY C.createdAt DESC;
        `,
        [req.user.id]
      );
      res.status(200).json(rows.map((i) => i.result));
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const deleteControler = asyncHandler(async (req, res) => {
  if (!req?.user?.email)
    res.status(404).json({ message: "Email id not found." });
  else {
    const sql = `
      Update Controler
      set isActive = 0
      where id = ?`;
    const [result] = await pool.execute(sql, [req.body.id]);
    if (result.affectedRows > 0) res.status(200).json({ id: req.body.id });
    else
      res.status(404).json({ message: "Image not found or no changes made." });
  }
});

module.exports.createControler = createControler;
module.exports.getControler = getControler;
module.exports.deleteControler = deleteControler;
