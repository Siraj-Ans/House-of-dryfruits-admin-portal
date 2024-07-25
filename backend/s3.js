const AWS = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;
const accessKey = process.env.AWS_ACESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
  region: region,
});

const s3 = new S3({
  region,
  accessKey,
  secretAccessKey,
});

function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

exports.uploadMultipleFiles = async (files) => {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
};

function parseS3Url(url) {
  const urlParts = new URL(url);
  const objectKey = urlParts.pathname.substring(1); // Remove leading slash
  return objectKey;
}

exports.deleteFileFromS3 = async (url) => {
  const objectKey = parseS3Url(url);

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.deleteObject(params).promise();
    console.log("File deleted successfully:", data);
  } catch (err) {
    console.error("Error deleting file:", err.message);
  }
};
