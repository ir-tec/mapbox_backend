const mongoose = require("mongoose");

const userValidatioinSchema = new mongoose.Schema({
  userId: String,
  uniqeString: String,
  createdAt: Date,
  verified: Boolean,
});

module.exports = mongoose.model("usersVerification", userValidatioinSchema);
