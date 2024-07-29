const multer = require("multer");

const MIME_TYPE = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg+xml",
};

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    if (isValid) {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid mime type"));
    }
  },
}).array("productImages");

module.exports = uploadMiddleware;

const prepareFilesForS3Upload = (req, res, next) => {
  req.files = req.files.map((file) => ({
    originalname: file.originalname,
    mimetype: file.mimetype,
    buffer: file.buffer,
    filename:
      file.originalname.toLowerCase().split(" ").join("-") +
      "-" +
      Date.now() +
      "." +
      MIME_TYPE[file.mimetype],
  }));

  next();
};

module.exports.prepareFilesForS3Upload = prepareFilesForS3Upload;
