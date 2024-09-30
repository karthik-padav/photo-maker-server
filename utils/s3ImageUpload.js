const fs = require("fs");
const aws = require("aws-sdk");

const S3 = new aws.S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
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
module.exports.uploadToS3 = uploadToS3;
