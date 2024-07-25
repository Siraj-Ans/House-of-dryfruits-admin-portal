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
        address2: req.body.address2,
      });

      const result = await order.save();

      res.status(200).json({
        message: "Successfully saved the order",
        order: result,
      });
    } catch {
      console.log(err);
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
    } catch (err) {
      console.log(err);
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

      console.log(
        await Order.updateOne(
          {
            _id: orderId,
          },
          {
            paid: paidStatus === "unpaid" ? false : true,
            trackingId: trackingId,
            fullfilled: shipmentStatus,
          }
        )
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
