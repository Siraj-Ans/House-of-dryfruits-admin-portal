const Review = require("../models/review");

exports.saveReview = (req, res) => {
  async function saveReviewOnDB() {
    try {
      const productId = req.body.productId;
      const title = req.body.title;
      const stars = req.body.stars;
      const comment = req.body.comment;

      const review = new Review({
        title: title,
        comment: comment,
        stars: stars,
        product: productId,
      });

      const result = await review.save();

      res.status(200).json({
        message: "Server failed to save the review!",
        review: review,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to save the review!",
      });
    }
  }

  saveReviewOnDB();
};

exports.fetchReviews = (req, res) => {
  async function fetchReviewFromDB() {
    try {
      const productId = req.query.productId;

      const reviews = await Review.find({
        product: productId,
      });

      res.status(200).json({
        message: "Successfully fetched the reviews!",
        reviews: reviews,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the reviews!",
      });
    }
  }

  fetchReviewFromDB();
};
