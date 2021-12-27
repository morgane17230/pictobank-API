const { Category } = require("../models");

const categoryController = {
  getCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.categoryId, {
        include: ["pictos"],
      });
      res.json(category);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: ["pictos"],
      });
      res.json(categories);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
  createCategory: async (req, res) => {
    try {
      const newCategory = await Category.create({
        name: req.body.name,
      });

      res.json(newCategory);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await Category.findByPk(Number(req.params.categoryId));
      
      updatedCategory.set({
        name: req.body.name,
      });

      await updatedCategory.save();

      res.json(updatedCategory);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  deleteCategory: async (req, res) => {
  
    try {
      const deletedCategory = await Category.findByPk(
        Number(req.params.categoryId)
      );
      await deletedCategory.destroy();
      res.json(deletedCategory);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
};

module.exports = categoryController;
