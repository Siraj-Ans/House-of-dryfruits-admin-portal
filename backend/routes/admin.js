const express = require("express");
const adminControllers = require("../controllers/admin");
const checkAuthMiddleware = require("../middlewares/check-auth.js");

const router = express.Router();

router.post("/createAdmin", checkAuthMiddleware, adminControllers.createAdmin);

router.get("/fetchAdmins", checkAuthMiddleware, adminControllers.fetchAdmins);

router.post("/updateAdmin", checkAuthMiddleware, adminControllers.updateAdmin);

router.delete(
  "/deleteAdmin",
  checkAuthMiddleware,
  adminControllers.deleteAdmin
);

module.exports = router;
