const Order = require("../models/order");

exports.createOrder = (req, res) => {
  async function saveOrderOnDB() {
    try {
      const order = new Order({
        user: req.body.user,
        emailAddress: req.body.emailAddress,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        postalCode: req.body.postalCode,
        address1: req.body.address1,
        paymentMethod: req.body.paymentMethod,
        productInfo: req.body.productInfo,
        paid: req.body.paid,
        fullfilled: req.body.fullfilled,
        completed: req.body.completed,
        address2: req.body.address2,
      });

      const result = await order.save();

      res.status(200).json({
        message: "Successfully saved the order",
        order: result,
      });
    } catch {
      res.status(500).json({
        message: "server failed to create order!",
      });
    }
  }

  saveOrderOnDB();
};

exports.cancelOrder = (req, res) => {
  async function removeOrderFromDB() {
    try {
      const userId = req.body.userId;
      const orderId = req.body.orderId;

      const result = await Order.deleteOne({
        user: userId,
        _id: orderId,
      });

      res.status(200).json({
        message: "Successfully removed the the order",
        order: result,
      });
    } catch {
      res.status(500).json({
        message: "server failed to remove the order!",
      });
    }
  }

  removeOrderFromDB();
};

exports.fetchOrders = (req, res) => {
  async function fetchOrdersFromDB() {
    try {
      const orders = await Order.find();

      res.status(200).json({
        message: "Successfully fetched the orders!",
        orders: orders,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch orders!",
      });
    }
  }

  fetchOrdersFromDB();
};

exports.fetchOrdersFront = (req, res) => {
  async function fetchOrdersFrontFromDB() {
    try {
      const userId = req.query.userId;

      const orders = await Order.find({
        user: userId,
      });

      res.status(200).json({
        message: "Successfully fetched the orders!",
        orders: orders,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch orders!",
      });
    }
  }

  fetchOrdersFrontFromDB();
};

exports.fetchOrder = (req, res) => {
  async function fetchOrderFromDB() {
    try {
      const userId = req.query.userId;
      const orderId = req.query.orderId;

      const order = await Order.findOne({
        user: userId,
        _id: orderId,
      });

      res.status(200).json({
        message: "Successfully fetched the order!",
        order: order,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch order!",
      });
    }
  }

  fetchOrderFromDB();
};

exports.updateOrder = (req, res) => {
  async function setOrderPaidOnDB() {
    try {
      const orderId = req.body.orderId;
      const trackingId = req.body.trackingId;
      const paidStatus = req.body.paidStatus;
      const shipmentStatus = req.body.shipmentStatus;

      await Order.updateOne(
        {
          _id: orderId,
        },
        {
          paid: paidStatus === "unpaid" ? false : true,
          trackingId: trackingId,
          fullfilled: shipmentStatus,
        }
      );

      res.status(200).json({
        message: "server successfully updated the order!",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to update the order!",
      });
    }
  }

  setOrderPaidOnDB();
};

exports.markOrderAsCompleted = (req, res) => {
  async function markOrderAsCompletedOnDB() {
    try {
      const orderId = req.body.orderId;

      const order = await Order.findOne({
        _id: orderId,
      });

      if (!order.paid)
        return res.status(400).json({
          message: "Order is not paid!",
        });

      if (order.fullfilled !== "delivered")
        return res.status(400).json({
          message: "Order is not delivered!",
        });

      await Order.updateOne(
        {
          _id: orderId,
        },
        {
          completed: true,
        }
      );

      res.status(200).json({
        message: "Successfully marked order as completed!",
      });
    } catch {
      res.status(400).json({
        message: "Server failed to marke the order as completed!",
      });
    }
  }

  markOrderAsCompletedOnDB();
};
