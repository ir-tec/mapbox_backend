const userModel = require("../model/userModel");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({ message: "password is incorrect" });
    }

    const token = jwt.sign(user._id.toString(), process.env.jwt_secret_token);
    res.status(200).json(token);
  } catch (error) {
    res.status(400).json({ message: "not found" });
  }
});
router.delete("/", async (req, res) => {
  try {
    await userModel.deleteMany({});
    res.status(200).json({ message: "all clear" });
  } catch (error) {}
});

module.exports = router;
