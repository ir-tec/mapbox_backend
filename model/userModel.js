const mongoose = require("mongoose");
const joi = require("joi");
const { string } = require("joi");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const validate = (user) => {
  const schema = joi.object({
    username: joi.string().required(""),
    email: joi.string().required().email(),
    password: joi.string().required(),
  });
  return schema;
};

const User = mongoose.model("users", userSchema);
module.exports = { User, validate };
