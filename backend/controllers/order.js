const Order = require("../models/order");
const crypto = require("crypto");

const TrackingMore = require("trackingmore-sdk-nodejs");

const key = "gsjg9woj-eazq-m740-ntcu-ucl9t1yqrtyo";
const trackingmore = new TrackingMore(key);

exports.createOrder = (req, res) => {
  async function saveOrderOnDB() {
    try {
      const uuID = crypto.randomBytes(16).toString("hex");

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
        trackingId: uuID,
        address2: req.body.address2,
      });

      const result = await order.save();

      const now = new Date();

      // Format year, month, day, hours, minutes, seconds as two digits
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const day = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      const params = {
        tracking_number: uuID,
        courier_code: "tcs-express",
        customer_name: result.firstName + " " + result.lastName,
        order_date: `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`,
        customer_email: result.emailAddress,
        customer_sms: result.phoneNumber,
        recipient_postcode: result.postalCode,
        title: "Title None",
        language: "en",
      };

      const trackingResult = await trackingmore.trackings.createTracking(
        params
      );

      console.log(trackingResult);

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

exports.cancelOrder = (req, res) => {
  async function removeOrderFromDB() {
    try {
      const userId = req.body.userId;
      const orderId = req.body.orderId;
      const trackingId = req.body.trackingId;

      const params = {
        tracking_numbers: trackingId,
        courier_code: "tcs-express",
      };

      const trackingInfo = await trackingmore.trackings.getTrackingResults(
        params
      );

      console.log(trackingInfo.data);

      const result = await Order.deleteOne({
        user: userId,
        _id: orderId,
      });

      const trackingResult = await trackingmore.trackings.deleteTrackingByID(
        trackingInfo.data[0].id
      );

      console.log(trackingResult, result);

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

  fetchOrdersFromDB();
};
