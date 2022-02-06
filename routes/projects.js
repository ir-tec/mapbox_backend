const router = require("express").Router();
const projects = require("../model/projects");
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
      country: req.body.country,
      city: req.body.city,
      lat: req.body.lat,
      lng: req.body.lng,
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

router.get("/:id", async (req, res) => {
  try {
    const current_prooject = await ProjectModels.findOne({
      _id: req.params.id,
    });
    res.status(200).json(current_prooject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const current_project = await ProjectModels.findOne({ _id: req.params.id });

    current_project.routes[0].coordinates = req.body.coordinates;
    current_project.routes[0].points = req.body.routes;

    await current_project.save();

    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/doc/:id", async (req, res) => {
  try {
    const current_project = await ProjectModels.findOne({ _id: req.params.id });

    current_project.project_name = req.body.project_name;
    current_project.country = req.body.country;
    current_project.city = req.body.city;

    await current_project.save();

    res.status(200).json({ message: "Updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:project_id/", async (req, res) => {
  try {
    await ProjectModels.deleteOne({
      _id: req.params.project_id,
    });
    res.status(200).json({ message: "project deleted" });
  } catch (error) {
    res.status(404).json({ message: "not found" });
  }
});

module.exports = router;
