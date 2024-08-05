const express = require("express");
const router = express.Router();
const contactUsControllers = require("../controllers/contactUs");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post("/contact-us", checkAuthMiddleware, contactUsControllers.contactUs);

module.exports = router;
