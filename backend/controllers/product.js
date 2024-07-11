const Product = require("../../backend/models/product");
const fs = require("fs");

exports.fetchProducts = (req, res) => {
  async function getProductsFromDB() {
    try {
      const products = await Product.find().populate("productCategory");

      res.status(200).json({
        message: "Successfully fetched the products!",
        products: products,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the products!",
      });
    }
  }
  getProductsFromDB();
};

exports.fetchCategoriesProducts = (req, res) => {
  async function getCategoriesProductsFromDB() {
    try {
      const categoriesIds = JSON.parse(req.query.categoryIds);

      const categoriesProducts = await Product.find(
        {
          productCategory: categoriesIds,
        },
        null,
        { limit: 5, sort: { _id: -1 } }
      ).populate("productCategory");

      res.status(200).json({
        message: "Successfully fetched the categories products!",
        categoriesProducts: categoriesProducts,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to fetch the categories products!",
      });
    }
  }
  getCategoriesProductsFromDB();
};

exports.fetchCategoryProducts = (req, res) => {
  async function getCategoryProductsFromDB() {
    try {
      const categoryId = req.query.categoryId;

      const categoryProducts = await Product.find(
        {
          productCategory: categoryId,
        },
        null,
        { sort: { _id: -1 } }
      ).populate("productCategory");

      res.status(200).json({
        message: "Successfully fetched the category products!",
        categoryProducts: categoryProducts,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to fetch the category products!",
      });
    }
  }
  getCategoryProductsFromDB();
};

exports.fetchNewProducts = (req, res) => {
  async function getNewProductsFromDB() {
    try {
      const products = await Product.find({}, null, {
        sort: { _id: -1 },
        limit: 10,
      });

      res.status(200).json({
        message: "Server failed to fetch the new products!",
        products: products,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the new products!",
      });
    }
  }

  getNewProductsFromDB();
};

exports.createProduct = (req, res) => {
  async function saveProductOnDB() {
    try {
      let productImages = [];
      const url = req.protocol + "://" + req.get("host");

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const imageUrl = url + "/productImages/" + req.files[i].filename;
          productImages.push(imageUrl);
        }
      }

      const product = new Product({
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productImages: productImages,
        description: req.body.description,
        priceInUSD: +req.body.priceInUSD,
      });

      const result = await product.save();

      const newProduct = await Product.findOne({ _id: result._id }).populate(
        "productCategory"
      );

      res.status(200).json({
        message: "successfully created the product!",
        product: newProduct,
      });
    } catch {
      res.status(500).json({
        message: "server failed to add the product!",
      });
    }
  }

  saveProductOnDB();
};

exports.updateProduct = (req, res) => {
  async function updatedProductOnDB() {
    try {
      let productImages;

      if (typeof req.body.existingImages === "string") {
        productImages = [req.body.existingImages];
      } else {
        productImages = [...req.body.existingImages];
      }
      const url = req.protocol + "://" + req.get("host");

      if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const imageUrl = url + "/productImages/" + req.files[i].filename;
          productImages.push(imageUrl);
        }
      }

      const result = await Product.updateOne(
        { _id: req.body.productID },
        {
          _id: req.body.productID,
          productName: req.body.productName,
          productCategory: req.body.productCategory,
          productImages: productImages,
          description: req.body.description,
          priceInUSD: req.body.priceInUSD,
        }
      );

      if (result.modifiedCount < 1)
        return res.status(500).json({
          message: "Could not update the product!",
        });

      res.status(200).json({
        message: "Successfully updated the product!",
      });
    } catch {
      res.status(500).json({
        message: "server failed to update the product!",
      });
    }
  }

  updatedProductOnDB();
};

exports.deleteProduct = (req, res) => {
  async function deleteProductFromDB() {
    try {
      const productID = req.query.productID;
      const product = await Product.findOne({ _id: productID });

      for (let i = 0; i < product.productImages.length; i++) {
        let path = product.productImages[i].split("/");

        path.splice(0, 3);
        path.unshift(
          "/Web Development/FYP/House-of-dryfruits-admin-portal/backend"
        );
        path = path.join("/");

        fs.unlink(path, (err) => {
          if (err) {
            console.error("There was an error deleting the file:", err);
          } else {
            console.log("File deleted successfully");
          }
        });
      }

      const result = await Product.deleteOne({ _id: productID });

      if (!result.deletedCount)
        return res.status(500).json({
          message: "Could not delete the admin",
        });

      res.status(200).json({
        message: "Successfully deleted the admin",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to delete the product!",
      });
    }
  }

  deleteProductFromDB();
};
