const Category = require("../models/category");
const Product = require("../models/product");

exports.createCategory = (req, res) => {
  async function saveCategoryOnDB() {
    try {
      let category = null;

      if (req.body.parent) {
        category = new Category({
          categoryName: req.body.categoryName,
          parent: req.body.parent,
          properties: req.body.properties,
        });
      } else {
        category = new Category({
          categoryName: req.body.categoryName,
          properties: req.body.properties,
        });
      }

      const result = await category.save();

      if (!result.parent)
        return res.status(200).json({
          message: "successfully added the category!",
          category: result,
        });

      const newCategory = await Category.findOne({
        _id: result._id,
      }).populate("parent");

      res.status(200).json({
        message: "successfully added the newcategory!",
        category: newCategory,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to create the category!",
      });
    }
  }

  saveCategoryOnDB();
};

exports.fetchCategories = (req, res) => {
  async function getCategoriesFromDB() {
    try {
      const categories = await Category.find().populate("parent");

      res.status(200).json({
        message: "Successfully fetched the categories",
        categories: categories,
      });
    } catch {
      res.status(500).json({
        message: "Server failed to fetch categories!",
      });
    }
  }

  getCategoriesFromDB();
};

exports.fetchCategory = (req, res) => {
  async function fetchCategoryFromDB() {
    const categoryId = req.query.categoryId;
    try {
      const category = await Category.findOne({ _id: categoryId }).populate(
        "parent"
      );

      res.status(200).json({
        message: "Successfully fetched the category!",
        category: category,
      });
    } catch {
      res.status(500).json({
        message: "server failed to fetch the category!",
      });
    }
  }

  fetchCategoryFromDB();
};

exports.fetchParentCategory = (req, res) => {
  ParentCategory.find()
    .then((documents) => {
      res.status(200).json({
        message: "Successfully fetched parent categories!",
        parentCategories: documents,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Server failed fetching parent categories!",
      });
    });
};

exports.updateCategory = (req, res) => {
  async function updateCategoryOnDB() {
    try {
      if (!req.body.id)
        return res.status().json({
          message: "Catgory ID missing!",
        });

      const category = await Category.findOne({
        _id: req.body.id,
      });

      if (!category)
        return res.status(404).json({
          message: "Please add category before editing!",
        });

      let updated = false;

      if (req.body.categoryName !== category.categoryName) {
        updated = true;
      } else if (!category.parent && req.body.parent) {
        updated = true;
      } else if (category.parent && !req.body.parent) {
        updated = true;
      } else if (category.parent && req.body.parent) {
        if (category.parent.toString() !== req.body.parent) {
          updated = true;
        }
      }

      if (!updated)
        return res.status(409).json({
          message:
            "The category details you entered already exist. Please try again.",
        });

      let result;

      if (req.body.parent) {
        result = await Category.updateOne(
          { _id: req.body.id },
          {
            _id: req.body.id,
            categoryName: req.body.categoryName,
            parent: req.body.parent,
            properties: req.body.properties,
          }
        );
      } else {
        result = await Category.updateOne(
          { _id: req.body.id },
          {
            $set: {
              _id: req.body.id,
              categoryName: req.body.categoryName,
              properties: req.body.properties,
            },
            $unset: {
              parent: "",
            },
          }
        );
      }

      res.status(200).json({
        message: "Successfully updated the category",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to update the category!",
      });
    }
  }

  updateCategoryOnDB();
};

exports.deleteCategory = (req, res) => {
  async function removeCategoryFromDB() {
    try {
      const categoryId = req.query.categoryID;

      const parentCategory = await Category.findOne({
        parent: categoryId,
      });

      let categoryProducts = await Product.find({
        productCategory: categoryId,
      });

      if (parentCategory)
        categoryProducts = await Product.find({
          productCategory: parentCategory._id,
        });

      if (categoryProducts.length !== 0) {
        return res.status(404).json({
          message: "Please delete category products first!",
        });
      }

      if (!categoryId)
        return res.status(400).json({
          message: "categoryID missing",
        });

      const result = await Category.deleteOne({ _id: categoryId });

      await Product.deleteMany({
        productCategory: categoryId,
      });

      if (!result.deletedCount)
        return res.status(500).json({
          message: "Could not delete the category",
        });

      res.status(200).json({
        message: "Successfully deleted the category",
      });
    } catch {
      res.status(500).json({
        message: "Server failed to delete category!",
      });
    }
  }
  removeCategoryFromDB();
};
