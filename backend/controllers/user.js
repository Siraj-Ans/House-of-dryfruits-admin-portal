const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.login = (req, res) => {
  async function findAdminOnDB() {
    try {
      console.log(req.body);
      if (!(await User.findOne({ emailAddress: req.body.emailAddress })))
        return res.status(400).json({
          message: "User not found!",
        });
      else if (!(await User.findOne({ password: req.body.password })))
        return res.status(400).json({
          message: "password is incorrect!",
        });

      const user = await User.findOne({
        emailAddress: req.body.emailAddress,
      });

      if (!user)
        return res.status(404).json({
          message: "User not found!",
        });

      const jwtToken = jwt.sign(
        {
          id: user.id,
          emailAddress: user.emailAddress,
          userName: user.userName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

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

exports.signup = (req, res) => {
  async function createUserOnDB() {
    const user = new User({
      userName: req.body.userName,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
    });

    try {
      const result = await user.save();

      res.status(200).json({
        message: "Successfully created the user!",
        user: result,
      });
    } catch {
      if (err.code === 11000) {
        return res.status(409).json({
          message: "User already exists with this email address !",
        });
      }
      res.status(500).json({
        message: "Server failed to create the user!",
      });
    }
  }

  createUserOnDB();
};
