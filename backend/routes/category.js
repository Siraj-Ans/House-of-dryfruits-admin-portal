const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/category");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post(
  "/createCategory",
  checkAuthMiddleware,
  categoryControllers.createCategory
);

router.get(
  "/fetchCategories",
  checkAuthMiddleware,
  categoryControllers.fetchCategories
);

router.put(
  "/updateCategory",
  checkAuthMiddleware,
  categoryControllers.updateCategory
);

router.delete(
  "/deleteCategory",
  checkAuthMiddleware,
  categoryControllers.deleteCategory
);

router.get(
  "/fetch-parent-categories",
  checkAuthMiddleware,
  categoryControllers.fetchParentCategory
);

module.exports = router;
