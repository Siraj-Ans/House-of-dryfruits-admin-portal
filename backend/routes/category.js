const express = require("express");
const router = express.Router();
const categoryControllers = require("../controllers/category");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post(
  "/createCategory",
  checkAuthMiddleware,
  categoryControllers.createCategory
);

router.get("/fetchCategories", categoryControllers.fetchCategories);

router.get("/fetchCategory", categoryControllers.fetchCategory);

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

router.get("/fetch-parent-categories", categoryControllers.fetchParentCategory);

module.exports = router;
