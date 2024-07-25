const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/order");
const checkAuthMiddleware = require("../middlewares/check-auth");

router.post("/createOrder", checkAuthMiddleware, orderControllers.createOrder);

router.get("/fetchOrders", checkAuthMiddleware, orderControllers.fetchOrders);

router.get("/fetchOrder", checkAuthMiddleware, orderControllers.fetchOrder);

router.post("/cancelOrder", checkAuthMiddleware, orderControllers.cancelOrder);

router.put("/updateOrder", checkAuthMiddleware, orderControllers.updateOrder);

module.exports = router;
