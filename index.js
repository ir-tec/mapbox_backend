const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
const Register = require("./routes/authentication");
const Login = require("./routes/authorization");
const Projects = require("./routes/projects");
const Users = require("./routes/Users");
const auth = require("./routes/auth_middleware");
const connection = require("./model/DB");

(async () => await connection())();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/register", Register);

app.use("/auth", Login);
app.use("/projects", auth, Projects);
app.use("/users", auth, Users);
app.listen(5000, () => {
  console.log("app is up");
});
