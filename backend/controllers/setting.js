const Setting = require("../models/setting");
const Product = require("../models/product");
const { isError } = require("util");

exports.saveFeaturedProduct = (req, res) => {
  async function saveSettingsOnDB() {
    try {
      const name = req.body.name;
      const value = req.body.value;

      const check = await Setting.findOne({
        name: name,
      });

      let result;

      if (check) {
        result = await Setting.updateOne(
          {
            _id: check._id,
          },
          {
            _id: check._id,
            value: value,
          }
        );

        return res.status(200).json({
          message: "Successfully updated the shipping fee!",
        });
      }

      const settings = new Setting({
        name: name,
        value: value,
      });

      await settings.save();

      res.status(200).json({
        message: "successfully saved the featured product!",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to save featured product!",
      });
    }
  }

  saveSettingsOnDB();
};

exports.saveShippingFee = (req, res) => {
  async function saveSettingsOnDB() {
    try {
      const name = req.body.name;
      const value = req.body.value;
      const id = req.body.id;

      const check = await Setting.findOne({
        name: name,
      });

      let result;

      if (check) {
        result = await Setting.updateOne(
          {
            _id: check._id,
          },
          {
            _id: check._id,
            value: value,
          }
        );

        return res.status(200).json({
          message: "Successfully updated the featured product!",
        });
      }
      const settings = new Setting({
        name: name,
        value: value,
      });

      await settings.save();

      res.status(200).json({
        message: "successfully saved the shipping fee!",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to save the shipping fee!",
      });
    }
  }

  saveSettingsOnDB();
};

exports.fetchSettings = (req, res) => {
  async function fetchSettingsFromDB() {
    try {
      const settings = await Setting.find();

      res.status(200).json({
        message: "successfully fetched the settings!",
        settings: settings,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch settings!",
      });
    }
  }

  fetchSettingsFromDB();
};

exports.fetchFeaturedProduct = (req, res) => {
  async function fetchFeaturedProductFromDB() {
    try {
      const result = await Setting.findOne({
        name: "Featured Product",
      });

      if (!result)
        return res.status(200).json({
          message: "No featured product found!",
        });
      else {
        const featuredProduct = await Product.findOne({
          _id: result.value.toString(),
        });

        res.status(200).json({
          message: "successfully fetched the featured product!",
          featuredProduct: featuredProduct,
        });
      }
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the featured product!",
      });
    }
  }

  fetchFeaturedProductFromDB();
};

exports.fetchShippingFee = (req, res) => {
  async function fetchShippingFeeFromDB() {
    try {
      const result = await Setting.findOne({
        name: "Shipping Fee",
      });

      res.status(200).json({
        message: "Successfully fetched the shipping fee",
        shippingFee: +result.value,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch shipping fee",
      });
    }
  }

  fetchShippingFeeFromDB();
};
