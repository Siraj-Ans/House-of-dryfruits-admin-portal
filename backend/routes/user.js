const express = require("express");
const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/login", userControllers.login);

router.post("/signup", userControllers.signup);

router.post("/changePassword", userControllers.changePassword);

module.exports = router;
