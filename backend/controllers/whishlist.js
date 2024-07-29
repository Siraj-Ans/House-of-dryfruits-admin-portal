const WishList = require("../models/whishlist");

exports.saveWishedProduct = (req, res) => {
  async function saveWishedProductOnDB() {
    try {
      console.log(req.body);
      const exists = await WishList.findOne({
        product: req.body.productId,
        user: req.body.userId,
      });

      if (exists)
        return res.status(409).json({
          message: "Product already exists in the wishlist!",
        });

      const wishedProduct = new WishList({
        user: req.body.userId,
        product: req.body.productId,
      });

      const result = await wishedProduct.save();

      res.status(200).json({
        message: "Successfully added the product to wishlist!",
        wishedProduct: result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server failed to add the product to wishlist.",
      });
    }
  }

  saveWishedProductOnDB();
};

exports.removeWishedProduct = (req, res) => {
  async function removeWishedProductFromDB() {
    try {
      const userId = req.query.userId;
      const productId = req.query.productId;

      const result = await WishList.deleteOne({
        user: userId,
        product: productId,
      });

      if (!result.deletedCount)
        return res.status(500).json({
          message: "Could not remove the product from wishlist!",
        });

      res.status(200).json({
        message: "Successfuly remove the product from the wishlist!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to remove the product from wishlist.",
      });
    }
  }

  removeWishedProductFromDB();
};

exports.removeWishedProductAccount = (req, res) => {
  async function removeWishedProductAccountFromDB() {
    try {
      const wishedProductId = req.query.wishedProductId;

      const result = await WishList.deleteOne({
        _id: wishedProductId,
      });

      if (!result.deletedCount)
        return res.status(500).json({
          message: "Could not remove the product from wishlist!",
        });

      res.status(200).json({
        message: "Successfuly remove the product from the wishlist!",
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to remove the product from wishlist.",
      });
    }
  }

  removeWishedProductAccountFromDB();
};

exports.getWishedProducts = (req, res) => {
  async function getWishedProductsFromDB() {
    try {
      const userId = req.query.userId;
      const newProducts = JSON.parse(req.query.newProducts);

      const wishedProducts = await WishList.find({
        user: userId,
        product: newProducts,
      });

      res.status(200).json({
        message: "Succcessfully fetched the wished products!",
        wishedProducts: wishedProducts,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the fetched products.",
      });
    }
  }

  getWishedProductsFromDB();
};

exports.getWishedProductsAccount = (req, res) => {
  async function getWishedProductsAccountFromDB() {
    try {
      const userId = req.query.userId;

      const wishedProducts = await WishList.find({
        user: userId,
      }).populate("product");

      res.status(200).json({
        message: "Succcessfully fetched the wished products!",
        wishedProducts: wishedProducts,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the fetched products.",
      });
    }
  }

  getWishedProductsAccountFromDB();
};
