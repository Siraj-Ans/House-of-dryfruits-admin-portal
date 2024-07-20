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
        address2: req.body.address2,
      });

      console.log(order);

      const result = await order.save();

      res.status(200).json({
        message: "Successfully saved the order",
        order: result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "server failed to create order!",
      });
    }
  }

  saveOrderOnDB();
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
