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

    // https://photo-maker.s3.ap-south-1.amazonaws.com/bg-collection/26.jpg

    // https://photo-maker.s3.us-east-1.amazonaws.com/bg-collection/11.jpg

    // Extract and return image URLs
    const getBucketRegion = async () => {
      try {
        const data = await S3.getBucketLocation({
          Bucket: bucketName,
        }).promise();
        return data.LocationConstraint || "us-east-1";
      } catch (error) {
        console.error("Error getting bucket region:", error);
      }
    };
    const region = await getBucketRegion();
    const images = data.Contents.map((item) => {
      console.log(item.Key, "item.Key");
      if (item.Key)
        return {
          key: item.Key,
          url: `https://${bucketName}.s3.${region}.amazonaws.com/${item.Key}`,
        };
      return null;
    });
    // console.log(images);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

module.exports.uploadToS3 = uploadToS3;
module.exports.getBgImages = getBgImages;
