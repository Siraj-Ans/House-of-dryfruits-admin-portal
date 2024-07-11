const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product");
const checkAuthMiddleware = require("../middlewares/check-auth");
const fileMiddleware = require("../middlewares/file");

router.post(
  "/createProduct",
  checkAuthMiddleware,
  fileMiddleware,
  productControllers.createProduct
);

router.get("/fetchProducts", productControllers.fetchProducts);

router.get("/fetchNewProducts", productControllers.fetchNewProducts);

router.get(
  "/fetchCategoriesProducts",
  productControllers.fetchCategoriesProducts
);

router.get("/fetchCategoryProducts", productControllers.fetchCategoryProducts);

router.put(
  "/updateProduct",
  checkAuthMiddleware,
  fileMiddleware,
  productControllers.updateProduct
);

router.delete(
  "/deleteProduct",
  checkAuthMiddleware,
  productControllers.deleteProduct
);

module.exports = router;
