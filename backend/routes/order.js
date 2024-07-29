const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/order");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post("/createOrder", checkAuthMiddleware, orderControllers.createOrder);

router.get("/fetchOrders", checkAuthMiddleware, orderControllers.fetchOrders);

router.get(
  "/fetchOrdersFront",
  checkAuthMiddleware,
  orderControllers.fetchOrdersFront
);

router.get("/fetchOrder", checkAuthMiddleware, orderControllers.fetchOrder);

router.post("/cancelOrder", checkAuthMiddleware, orderControllers.cancelOrder);

router.put("/updateOrder", checkAuthMiddleware, orderControllers.updateOrder);

router.put(
  "/markOrderAsCompleted",
  checkAuthMiddleware,
  orderControllers.markOrderAsCompleted
);

module.exports = router;
