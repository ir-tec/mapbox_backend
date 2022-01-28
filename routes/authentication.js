const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../model/userModel");
const UserVerification = require("../model/userVerification");
const nodeMailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
router.post("/", async (req, res) => {
  try {
    const check_exist = await UserModel.exists({ email: req.body.email });
    if (check_exist) return res.status(402).json({ message: "user exists" });

    const hash = await bcrypt.hash(req.body.password, 10);
    let user = new UserModel({ email: req.body.email, password: hash });
    await user.save();

    res.status(200).json({ message: "User successfully created " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
