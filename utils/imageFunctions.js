const fs = require("fs");
const path = require("path");
const getImagePath = (req, imageName) => {
  if (imageName) {
    return req.protocol + "://" + req.get("host") + "/uploads/" + imageName;
  } else {
    return null;
  }
};

const removeImage = (image) => {
  let imagePath = path.join(__dirname, "../public/uploads/" + image);
  if (fs.existsSync(imagePath)) {
    return fs.unlink(imagePath, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  }
};

module.exports = { getImagePath, removeImage };
