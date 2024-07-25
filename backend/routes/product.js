const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/product");
const checkAuthMiddleware = require("../middlewares/check-auth");
const uploadMiddleware = require("../middlewares/file"); // Adjust the path as needed
const { prepareFilesForS3Upload } = require("../middlewares/file");

router.post(
  "/createProduct",
  checkAuthMiddleware,
  uploadMiddleware,
  prepareFilesForS3Upload,
  productControllers.createProduct
);

router.get("/fetchProducts", productControllers.fetchProducts);

router.get("/fetchProductsFront", productControllers.fetchProductsFront);

router.get("/fetchProduct", productControllers.fetchProduct);

router.get("/fetchNewProducts", productControllers.fetchNewProducts);

router.get(
  "/fetchCategoriesProducts",
  productControllers.fetchCategoriesProducts
);

router.get("/fetchCartProducts", productControllers.fetchCartProducts);

router.get("/fetchCategoryProducts", productControllers.fetchCategoryProducts);

router.get(
  "/fetchOldestCategoryProducts",
  productControllers.fetchOldestCategoryProducts
);

router.get(
  "/fetchCategoryProductsByLowestPrice",
  productControllers.fetchCategoryProductsByLowestPrice
);

router.get(
  "/fetchCategoryProductsByHighestPrice",
  productControllers.fetchCategoryProductsByHighestPrice
);

router.put(
  "/updateProduct",
  checkAuthMiddleware,
  uploadMiddleware,
  prepareFilesForS3Upload,
  productControllers.updateProduct
);

router.delete(
  "/deleteProduct",
  checkAuthMiddleware,
  productControllers.deleteProduct
);

module.exports = router;
