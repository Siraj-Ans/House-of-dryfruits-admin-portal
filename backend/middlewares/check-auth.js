const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, "7E4Yu@bx");

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Auth failed!",
    });
  }
};
