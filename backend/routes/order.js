const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/order");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post("/createOrder", checkAuthMiddleware, orderControllers.createOrder);

router.get("/fetchOrders", orderControllers.fetchOrders);

router.post("/cancelOrder", checkAuthMiddleware, orderControllers.cancelOrder);

module.exports = router;
