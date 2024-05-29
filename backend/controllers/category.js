const Category = require("../../backend/models/category");

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
      console.log("result: ", result);

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
        message: "Server failed to create admin!",
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
  console.log("haha: ", req.body);
  Category.updateOne(
    { _id: req.body.id },
    {
      _id: req.body.id,
      categortName: req.body.categortName,
      parent: req.body.parent.id,
      properties: req.body.properties,
    }
  )
    .then((result) => {
      console.log(result);
      if (result.modifiedCount) {
        res.status(200).json({
          message: "Successfully edited the category!",
        });

        return;
      } else {
        res.status(401).json({
          message: "Couldn't edit the category!",
        });

        return;
      }
    })
    .catch((err) => {
      console.log(err);
      if (!res.headersSent)
        res.status(500).json({
          message: "Server failed to edit the category!",
        });
    });
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
  //   Category.deleteOne({ _id: id })
  //     .then((result) => {
  //       if (result.deletedCount > 0) {
  //         res.status(200).json({
  //           message: "successfully deleted the category",
  //         });

  //         return;
  //       } else {
  //         res.status(404).json({
  //           message: "couldn't delete the category",
  //         });

  //         return;
  //       }
  //     })
  //     .catch(() => {
  //       if (!res.headersSent)
  //         res.status(404).json({
  //           message: "could't delete the category!",
  //         });
  //     });
};
