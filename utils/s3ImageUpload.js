const fs = require("fs");
const aws = require("aws-sdk");

const S3 = new aws.S3({
  // region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRETACCESS_KEY,
});

async function uploadToS3(params) {
  const { file, filePath = "" } = params;
  const _params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filePath,
    Body: file,
  };
  return S3.upload(_params).promise();
}

async function getBgImages() {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const params = {
      Bucket: bucketName,
      Prefix: "bg-collection/",
    };

    const data = await S3.listObjectsV2(params).promise();

    if (!data.Contents || data.Contents.length === 0) {
      console.log("No images found in the folder.");
      return [];
    }

    const images = data.Contents.map((item) => {
      const isImage = (filename) =>
        /\.(png|jpg|jpeg|gif|webp|svg|bmp|tiff)$/i.test(filename);
      if (isImage(item.Key)) return { key: item.Key };
      return null;
    });
    return images.filter((i) => i);
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

module.exports.uploadToS3 = uploadToS3;
module.exports.getBgImages = getBgImages;
