const express = require("express");
const router = express.Router();
const reviewControllers = require("../controllers/review");
const checkAuthMiddleware = require("../middlewares/check-auth");
const fileMiddleware = require("../middlewares/file");

router.post(
  "/saveReview",
  checkAuthMiddleware,
  fileMiddleware,
  reviewControllers.saveReview
);

router.get("/fetchReviews", reviewControllers.fetchReviews);

module.exports = router;
