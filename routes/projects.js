const router = require("express").Router();
const ProjectModels = require("../model/projects");
const userModel = require("../model/userModel");
router.get("/", (req, res) => {
  ProjectModels.find({ user_id: req.userId }).then((result, reject) => {
    if (reject)
      return res
        .status(500)
        .json({ message: "somethings wrong with data base" });
    res.status(200).json(result);
  });
});

router.post("/", async (req, res) => {
  try {
    const user = await userModel.find({ _id: req.userId });
    ProjectModels.create({
      project_name: req.body.project_name,
      user_id: req.userId,
      routes: req.body.routes,
    })
      .then((result) => {
        res.status(200).json({ message: "created" });
        // console.log(rej.message);
      })
      .catch((err) => {
        res.status(400).json({ message: err.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    ProjectModels.deleteMany({}).then((result, rej) => {
      if (rej) return console.log("rej", rej);
      console.log("res", result);
    });
  } catch (error) {}
});

module.exports = router;
