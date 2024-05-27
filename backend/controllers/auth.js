const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

exports.login = (req, res) => {
  async function findAdminOnDB() {
    try {
      if (!(await Admin.findOne({ userName: req.body.userName })))
        return res.status(400).json({
          message: "username is incorrect!",
        });
      else if (!(await Admin.findOne({ password: req.body.password })))
        return res.status(400).json({
          message: "password is incorrect!",
        });

      const user = await Admin.findOne({
        userName: req.body.userName,
        password: req.body.password,
      });

      if (!user)
        return res.status(404).json({
          message: "User not found!",
        });

      const jwtToken = jwt.sign({ userName: user.userName }, "7E4Yu@bx", {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "User found!",
        user: user,
        token: jwtToken,
        expiresIn: 3600,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to find user! please try again.",
      });
    }
  }

  findAdminOnDB();
};
