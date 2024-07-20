const express = require("express");
const userControllers = require("../controllers/user");

const router = express.Router();

router.post("/login", userControllers.login);

router.post("/signup", userControllers.signup);

module.exports = router;
