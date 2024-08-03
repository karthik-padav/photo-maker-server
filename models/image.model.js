const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageURL: { type: String, required: true },
    email: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.models.Image || mongoose.model("Image", imageSchema);
