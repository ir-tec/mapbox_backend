const router = require("express").Router();
const bcrypt = require("bcrypt");
const { randomInt } = require("crypto");
const { User } = require("../model/userModel");
const Token = require("../model/tokenModel");
const sendEmail = require("../routes/SendEmail");

// ---------------------------------------------------------------------------------------try-register
router.post("/", async (req, res) => {
  let temp_token;
  randomInt(9999, (err, n) => {
    if (err) return;
    temp_token = n;
  });
  try {
    const check_exist = await User.exists({ email: req.body.email });
    if (check_exist) return res.status(402).json({ message: "user exists" });

    const hash = await bcrypt.hash(req.body.password, 10);
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    await user.save();

    let token = await new Token({
      userId: user._id,
      token: temp_token.toString(),
    }).save();
    const message = `
    Wellcome to Spatigo 
    Your verification code is : ${token.token}
    `;
    await sendEmail(user.email, "Verify Email", message);

    res.status(200).json({
      message: "Check your email for verification code",
      id: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// --------------------------------------------------------------------------------------- resend token
router.post("/get_code", async (req, res) => {
  let temp_token;
  randomInt(9999, (err, n) => {
    if (err) return;
    temp_token = n;
  });
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    const token = await Token.findOne({ userId: req.body.id });
    if (token) await token.remove();
    const new_token = await new Token({
      userId: req.body.id,
      token: temp_token,
    }).save();
    const message = `
    Wellcome to Spatigo 
    Your verification code is : ${new_token.token}
    `;
    await sendEmail(user.email, "Verify Email", message);

    res.status(200).json({
      message: "Check your email for verification code",
      id: req.body.id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// --------------------------------------------------------------------------------------- verification code
router.post("/verify", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return res.status(400).json({ message: "User not exist" });

    const token = await Token.findOne({
      userId: req.body.id,
      token: req.body.token,
    });
    if (!token) return res.status(401).json({ message: "Token is invalid" });

    user.verified = true;
    await user.save();
    await Token.deleteOne({ userId: req.body.id });

    res.status(200).json({ message: "User Verified" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/tokens", async (req, res) => {
  try {
    const tokens = await Token.find({});
    res.send(tokens);
  } catch (error) {}
});
router.delete("/tokens", async (req, res) => {
  try {
    const tokens = await Token.deleteMany({});
    res.send(tokens);
  } catch (error) {}
});

router.post("/try_reset", async (req, res) => {
  let temp_token;
  randomInt(9999, (err, n) => {
    if (err) return;
    temp_token = n;
  });
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not exist" });
    const token = await Token.findOne({ userId: user._id });
    if (token) token.remove();
    const new_token = await new Token({
      userId: user._id,
      token: temp_token.toString(),
    }).save();
    const message = `
    Wellcome to Spatigo 
    Your verification code is : ${new_token.token}
    `;
    await sendEmail(user.email, "Verify Email", message);

    res.status(200).json({
      message: "Check your email for verification code",
      id: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/reset_password", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return res.status(404).json({ message: "User not exists" });
    const token = await Token.findOne({
      token: req.body.token,
      userId: req.body.id,
    });
    if (!token) return res.status(401).json({ message: "Token is invalid" });
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
    await user.save();
    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
