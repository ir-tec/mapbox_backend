const Router = require("express").Router();
const { User } = require("../model/userModel");
Router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    users.forEach((item) => {
      item.password = "";
      if (item.photo) {
        item.photo = `${process.env.BASE_URL}/auth/images/${item.photo}`;
      }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

Router.delete("/:id", async (req, res) => {
  console.log("asdasd");
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User Deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
module.exports = Router;
