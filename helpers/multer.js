const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // You can specify the folder where the file will be saved
    cb(null, 'uploads/'); // Specify the folder you want to use
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
