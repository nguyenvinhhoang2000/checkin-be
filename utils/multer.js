const multer = require("multer");
const path = require("path");

//Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, files, cb) => {
    let ext = path.extname(files.originalname);
    if (ext !== ".jpg" && ext != ".jpge" && ext !== ".png") {
      cb(new Error("Tệp không được hỗ trợ"), false);
      return;
    }

    cb(null, true);
  },
});
