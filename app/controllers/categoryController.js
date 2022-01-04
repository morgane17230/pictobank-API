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

  getAllCategories: async (_, res) => {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
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
      const [category, created] = await Category.findOrCreate({
        where: { name: req.body.name },
      });

      if (created) {
        res.status(200).json({
          created,
          validation: `La nouvelle catégorie a bien été créée`,
        });
      } else if (category) {
        res
          .status(500)
          .json({ error: "Un catégorie portant ce nom existe déjà" })
          .toString();
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await Category.findByPk(req.params.categoryId);

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
      const deletedCategory = await Category.findByPk(req.params.categoryId);
      await deletedCategory.destroy();
      res.json(deletedCategory);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
};

module.exports = categoryController;
