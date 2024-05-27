const express = require("express");
const checkAuthMiddleWare = require("../middlewares/check-auth");
const authControllers = require("../controllers/auth");

const router = express.Router();

router.post("", authControllers.login);

module.exports = router;
