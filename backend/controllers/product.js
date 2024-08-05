const Product = require("../models/product");
const WishList = require("../models/whishlist");
const Review = require("../models/review");
const Setting = require("../models/setting");
const redis = require("redis");

const { uploadMultipleFiles } = require("../s3");
const { deleteFileFromS3 } = require("../s3");

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = redis.createClient({
  url,
  password: process.env.REDIS_KEY,
});

async function conntectToRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to redis successfully!");
  } catch (err) {
    console.log(err);
  }
}

conntectToRedis();

exports.createProduct = (req, res) => {
  async function saveProductOnDB() {
    try {
      const s3Result = await uploadMultipleFiles(req.files);

      let productImages = [];

      for (let i = 0; i < s3Result.length; i++) {
        productImages.push(s3Result[i].Location);
      }

      const product = new Product({
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productImages: productImages,
        description: req.body.description,
        priceInPKR: +req.body.priceInPKR,
      });

      const result = await product.save();

      await redisClient.del("products");

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
      const product = await Product.findOne({
        _id: req.body.productID,
      });

      imageNames = [];
      existingImageNames = [];

      for (let i = 0; i < product.productImages.length; i++) {
        const urlParts = new URL(product.productImages[i]);
        const objectKey = urlParts.pathname.substring(1);

        imageNames.push(objectKey);
      }

      let existingImages = [];
      if (typeof req.body.existingImages === "string")
        existingImages.push(req.body.existingImages);
      else if (typeof req.body.existingImages === "object") {
        existingImages = req.body.existingImages;
      }

      for (let i = 0; i < existingImages.length; i++) {
        const urlParts = new URL(existingImages[i]);
        const objectKey =
          urlParts.pathname.split("/")[urlParts.pathname.split("/").length - 1];

        existingImageNames.push(objectKey);
      }

      let newFiles = req.files;
      let toBeRemoved = [];
      let toBeAddedBack = [];

      imageNames.forEach((imageName, index) => {
        if (!existingImageNames.includes(imageName)) {
          toBeRemoved.push(product.productImages[index]);
        } else {
          toBeAddedBack.push(product.productImages[index]);
        }
      });

      for (let i = 0; i < toBeRemoved.length; i++) {
        await deleteFileFromS3(toBeRemoved[i]);
      }

      const s3Result = await uploadMultipleFiles(newFiles);

      let productImages = [];

      for (let i = 0; i < s3Result.length; i++) {
        productImages.push(s3Result[i].Location);
      }

      await Product.updateOne(
        { _id: req.body.productID },
        {
          _id: req.body.productID,
          productName: req.body.productName,
          productCategory: req.body.productCategory,
          productImages: [...toBeAddedBack, ...productImages],
          description: req.body.description,
          priceInPKR: +req.body.priceInPKR,
        }
      );

      await redisClient.del("products");

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

exports.fetchProducts = (req, res) => {
  async function getProductsFromDB() {
    try {
      const redisProducts = await redisClient.get("products");

      if (redisProducts)
        return res.status(200).json({
          message: "Successfully fetched the products!",
          products: JSON.parse(redisProducts),
        });

      const products = await Product.find().populate("productCategory");
      await redisClient.set("products", JSON.stringify(products), {
        EX: 10 * 60,
      });

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

exports.fetchProductsFront = (req, res) => {
  async function getProductsFrontFromDB() {
    try {
      const pageSize = req.query.pageSize;
      const currentPage = req.query.currentPage;
      const productsQuery = Product.find();
      let productsCount = await Product.find();
      productsCount = productsCount.length;

      let products = [];

      if (pageSize && currentPage) {
        products = await productsQuery
          .skip(pageSize * (currentPage - 1))
          .limit(pageSize);
      } else {
        products = await productsQuery.find();
      }

      res.status(200).json({
        message: "Successfully fetched the products!",
        products: products,
        productsCount: productsCount,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the products!",
      });
    }
  }
  getProductsFrontFromDB();
};

exports.fetchProduct = (req, res) => {
  async function getProductFromDB() {
    try {
      const productId = req.query.productId;

      const product = await Product.findOne({ _id: productId });

      res.status(200).json({
        message: "Successfully fetched the product!",
        product: product,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch the product!",
      });
    }
  }
  getProductFromDB();
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
      );

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
      );

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

exports.fetchOldestCategoryProducts = (req, res) => {
  async function getOldestCategoryProductsFromDB() {
    try {
      const categoryId = req.query.categoryId;

      const categoryProducts = await Product.find(
        {
          productCategory: categoryId,
        },
        null,
        { sort: { _id: 1 } }
      );

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
  getOldestCategoryProductsFromDB();
};

exports.fetchCategoryProductsByLowestPrice = (req, res) => {
  async function getCategoryProductsByLowestPriceFromDB() {
    try {
      const categoryId = req.query.categoryId;

      const categoryProducts = await Product.find(
        {
          productCategory: categoryId,
        },
        null,
        { sort: { priceInPKR: 1 } }
      );

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
  getCategoryProductsByLowestPriceFromDB();
};

exports.fetchCategoryProductsByHighestPrice = (req, res) => {
  async function getCategoryProductsByHighestPriceFromDB() {
    try {
      const categoryId = req.query.categoryId;

      const categoryProducts = await Product.find(
        {
          productCategory: categoryId,
        },
        null,
        { sort: { priceInPKR: -1 } }
      );

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
  getCategoryProductsByHighestPriceFromDB();
};

exports.fetchCartProducts = (req, res) => {
  async function getCartProductsFromDB() {
    try {
      const productIds = JSON.parse(req.query.productIds);
      const cartProducts = await Product.find({
        _id: productIds,
      });

      res.status(200).json({
        message: "Successfully fetched the cart products!",
        products: cartProducts,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server failed to fetch the cart products!",
      });
    }
  }
  getCartProductsFromDB();
};

exports.fetchNewProducts = (req, res) => {
  async function getNewProductsFromDB() {
    try {
      const redisProducts = await redisClient.get("newProducts");

      if (redisProducts)
        return res.status(200).json({
          message: "Successfully fetched the products!",
          products: JSON.parse(redisProducts),
        });

      const products = await Product.find({}, null, {
        sort: { _id: -1 },
        limit: 10,
      });

      await redisClient.set("newProducts", JSON.stringify(products), {
        EX: 10 * 60,
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

exports.deleteProduct = (req, res) => {
  async function deleteProductFromDB() {
    try {
      const productID = req.query.productID;
      const product = await Product.findOne({ _id: productID });

      const result = await Product.deleteOne({ _id: productID });

      const productImages = product.productImages;

      if (productImages.length > 0)
        for (let i = 0; i < productImages.length; i++) {
          await deleteFileFromS3(productImages[i]);
        }

      await WishList.deleteMany({
        product: productID,
      });

      await Review.deleteMany({
        product: productID,
      });

      await Setting.deleteMany({
        name: "Featured Product",
        value: productID,
      });

      if (!result.deletedCount)
        return res.status(500).json({
          message: "Could not delete the admin",
        });

      await redisClient.del("products");

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
