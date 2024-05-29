const express = require("express");
const adminsControllers = require("../controllers/admin");
const checkAuthMiddleware = require("../middlewares/check-auth.js");

const router = express.Router();

router.post("/createAdmin", checkAuthMiddleware, adminsControllers.createAdmin);
router.get("/fetchAdmins", checkAuthMiddleware, adminsControllers.fetchAdmins);
router.delete(
  "/deleteAdmin",
  checkAuthMiddleware,
  adminsControllers.deleteAdmin
);

module.exports = router;
