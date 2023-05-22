const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "uploads"));
  },

  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    // file.mimetype === "image/jpeg" ||
    file.mimetype.includes("image")
    // file.mimetype === "image/jpg" ||
    // file.mimetype === "image/svg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 mb
  },
  fileFilter: fileFilter,
});

module.exports = upload;
