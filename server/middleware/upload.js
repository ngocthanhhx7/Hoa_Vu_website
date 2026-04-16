const multer = require('multer');
const path = require('path');
const config = require('../config/config');

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf|mp4/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
    return;
  }

  cb(new Error('Chi chap nhan file anh (JPEG, PNG, GIF, WEBP, SVG), PDF hoac MP4'), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  fileFilter,
});

module.exports = upload;
