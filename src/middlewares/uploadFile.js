const multer = require("multer");

const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only Image files are allowed.."), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File size is too large.."), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not match.."), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
