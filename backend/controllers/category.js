const Category = require("../models/category");

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
        message: "Server failed to create admin!",
      });
    }
  }

  getCategoriesFromDB();
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
      throw "";
      if (!req.body.id)
        return res.status().json({
          message: "Catgory ID missing!",
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
            _id: req.body.id,
            categoryName: req.body.categoryName,
            properties: req.body.properties,
          }
        );
      }

      if (result.modifiedCount < 1)
        return res.status(500).json({
          message: "Could not update the category",
        });

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
      if (!req.query.categoryID)
        return res.status(400).json({
          message: "categoryID missing",
        });

      const result = await Category.deleteOne({ _id: req.query.categoryID });

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
