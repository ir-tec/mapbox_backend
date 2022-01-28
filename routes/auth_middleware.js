const jwt = require("jsonwebtoken");

const auth_middleware = (req, res, next) => {
  const authHeader = req.headers["token"];
  if (!authHeader) return res.sendStatus(401);

  jwt.verify(authHeader, process.env.jwt_secret_token, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user;

    next();
  });
};

module.exports = auth_middleware;
