const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const crypto = require("crypto");
const path = require("path");

const conn = mongoose.createConnection(process.env.db_connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const storage = new GridFsStorage({
  url: process.env.db_connection_string,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });
module.exports = { conn, upload };
