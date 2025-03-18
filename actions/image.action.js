const Image = require("../models/image.model.js");
const asyncHandler = require("express-async-handler");
const { uploadToS3, getBgImages } = require("../utils/s3ImageUpload");
const { uid } = require("uid");
const { pool } = require("../config/dbConnection.js");

const generateImage = asyncHandler(async (req, res) => {
  try {
    const filename = `${uid(16)}.png`;
    if (req.file.buffer) {
      const s3Resp = await uploadToS3({
        file: req.file.buffer,
        filePath: `${process.env.S3_DIR}/my-photos/${req.user.id}/${filename}`,
      });

      const sql = `
        INSERT INTO Image (id, userId, bucket, imagePath)
        VALUES (?, ?, ?, ?)`;

      const imageId = uid(16);
      const [result] = await pool.execute(sql, [
        imageId,
        req.user.id,
        s3Resp.Bucket,
        s3Resp.Key || s3Resp.key,
      ]);
      if (result.affectedRows > 0) {
        const [rows] = await pool.execute("SELECT * FROM Image WHERE id = ?", [
          imageId,
        ]);
        if (rows.length) res.status(200).json(rows[0]);
        else res.status(200).json({});
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const getImage = asyncHandler(async (req, res) => {
  try {
    if (!req?.user?.email)
      res.status(404).json({ message: "Email id not found." });
    else {
      const [rows] = await pool.execute(
        "SELECT * FROM Image WHERE userId = ? and isActive = 1 ORDER BY createdAt DESC",
        [req.user.id]
      );
      res.status(200).json(rows);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const getAllBgImage = asyncHandler(async (_, res) => {
  try {
    const resp = await getBgImages();
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  if (!req?.user?.email)
    res.status(404).json({ message: "Email id not found." });
  else {
    const sql = `
      Update Image
      set isActive = 0
      where id = ?`;
    const [result] = await pool.execute(sql, [req.body.id]);
    if (result.affectedRows > 0) res.status(200).json({ id: req.body.id });
    else
      res.status(404).json({ message: "Image not found or no changes made." });
  }
});

module.exports.getImage = getImage;
module.exports.getAllBgImage = getAllBgImage;
module.exports.generateImage = generateImage;
module.exports.deleteImage = deleteImage;
