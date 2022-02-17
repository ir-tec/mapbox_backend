const mongoose = require("mongoose");

module.exports = async function connection() {
  try {
    await mongoose.connect(process.env.db_connection_string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("not connected");
  }
};
