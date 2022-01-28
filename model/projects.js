const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
  coordinates: {
    type: Array,
    required: true,
  },
  points: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
});
const projectSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  createdAd: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  routes: [routeSchema],
});

module.exports = mongoose.model("projects", projectSchema);
