const mongoose = require("mongoose");

const controlerSchema = new mongoose.Schema(
  {
    controler: { type: JSON, required: true },
    email: { type: String, required: true },
    downloadedImageKey: { type: String, required: true },
    bucket: { type: String, required: true },
    imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports =
  mongoose.models.Controler || mongoose.model("Controler", controlerSchema);
