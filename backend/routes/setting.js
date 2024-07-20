const express = require("express");
const router = express.Router();
const settingControllers = require("../controllers/setting");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post(
  "/saveFeaturedProduct",
  checkAuthMiddleware,
  settingControllers.saveFeaturedProduct
);

router.get("/fetchFeaturedProduct", settingControllers.fetchFeaturedProduct);

router.get("/fetchShippingFee", settingControllers.fetchShippingFee);

router.post(
  "/saveShippingFee",
  checkAuthMiddleware,
  settingControllers.saveShippingFee
);

router.get("/fetchSettings", settingControllers.fetchSettings);

module.exports = router;
