const express = require("express");
const app = express();
const Register = require("./routes/authentication");
const Login = require("./routes/authorization");
const Projects = require("./routes/projects");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./routes/auth_middleware");

mongoose.connect(process.env.db_connection_string, () => {
  console.log("connected");
});
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/register", Register);

app.use("/auth", Login);
app.use("/projects", auth, Projects);
app.listen(5000, () => {
  console.log("app is up");
});
