const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");

aws.config.update({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.AWSRegion,
});
const s3 = new aws.S3();

const uploadImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSBucketIm,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (_, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("path");

const uploadAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWSBucketAv,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (_, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_, file, cb) => {
      cb(null, `${file.originalname.split('.')[0]}.webp`);
    },
  }),
}).single("path");

module.exports = {
  uploadImages,
  uploadAvatar
};
