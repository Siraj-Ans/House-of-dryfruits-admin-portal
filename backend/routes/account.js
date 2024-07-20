const express = require("express");
const accountControllers = require("../controllers/account");
const checkAuthMiddleware = require("../middlewares/check-auth.js");

const router = express.Router();

router.post(
  "/saveAccountDetails",
  checkAuthMiddleware,
  accountControllers.saveAccountDetails
);

router.post(
  "/updateAccountDetails",
  checkAuthMiddleware,
  accountControllers.updateAccountDetails
);

router.get(
  "/fetchAccountDetails",
  checkAuthMiddleware,
  accountControllers.fetchAccountDetails
);

module.exports = router;
