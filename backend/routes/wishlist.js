const express = require("express");
const wishListControllers = require("../controllers/whishlist");
const checkAuthMiddleware = require("../middlewares/check-auth.js");

const router = express.Router();

router.post(
  "/saveToWishList",
  checkAuthMiddleware,
  wishListControllers.saveWishedProduct
);

router.delete(
  "/removeFromWishList",
  checkAuthMiddleware,
  wishListControllers.removeWishedProduct
);

router.delete(
  "/removeFromWishListAccount",
  checkAuthMiddleware,
  wishListControllers.removeWishedProductAccount
);

router.get(
  "/fetchWishedProducts",
  checkAuthMiddleware,
  wishListControllers.getWishedProducts
);

router.get(
  "/fetchWishedProductsAccount",
  checkAuthMiddleware,
  wishListControllers.getWishedProductsAccount
);

module.exports = router;
