const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
tokenSchema.index({ createdAt: 3 }, { expires: "10m" });

const Token = mongoose.model("token", tokenSchema);

module.exports = Token;
