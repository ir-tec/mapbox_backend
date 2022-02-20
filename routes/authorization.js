const { User } = require("../model/userModel");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Token = require("../model/tokenModel");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const SendEmail = require("./SendEmail");
const auth = require("./auth_middleware");
const { conn, upload } = require("../middleware/Upload_middleware");
const Grid = require("gridfs-stream");
const Mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({ message: "password is incorrect" });
    }
    if (!user.verified)
      return res
        .status(401)
        .json({ message: "User is not verified", id: user._id });

    const token = jwt.sign(user._id.toString(), process.env.jwt_secret_token);
    res.status(200).json({
      token,
      user_info: {
        ...user._doc,
        password: "",
        avatar: user.photo && `/auth/images/${user.photo}`,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/try_forget", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "User not found" });

    let token = await Token.findOne({ user_id: user._id });
    if (!token) {
      let temp_token;
      await randomInt(9999, (err, n) => {
        if (err) return;
        console.log(n);
        temp_token = n;
      });

      token = await new Token({
        user_id: user._id,
        token: temp_token.toString(),
      }).save();
    }
    const Link = `${process.env.BASE_URL}/password_reset/${user._id}/${token.token}`;
    await SendEmail(user.email, "password_reset", Link);
    res.json({ message: "Reset password link sended to your email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, Mongoose.mongo);
  gfs.collection("uploads");
});

router.put(
  "/update_profile",
  auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      const hash = await bcrypt.hash(req.body.password, 10);
      if (req.file) {
        const old_photo = await gfs.files.findOne({ filename: user.photo });
        if (old_photo) {
          await gfs.remove({ filename: user.photo });
        }

        user.photo = req.file.filename;
      }
      user.username = req.body.username;
      user.password = hash;
      user.address = req.body.address;
      user.phone = req.body.phone;

      await user.save();
      res.status(200).json({
        ...user._doc,
        password: "",
        avatar: user.photo && `/auth/images/${user.photo}`,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/images/:filename", async (req, res) => {
  try {
    let file = await gfs.files.findOne({ filename: req.params.filename });
    // if (file.contentType === "image/jpeg" || file.contentType === "image/png") {

    const readStream = await gfs.createReadStream(file.filename);

    readStream.pipe(res);
    // }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
