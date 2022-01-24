const { Category } = require("../models");

const categoryController = {
  getCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.categoryId, {
        include: ["pictos"],
      });
      res.json(category);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  getAllCategories: async (_, res) => {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
        include: ["pictos"],
      });
      res.json(categories);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createCategory: async (req, res) => {
    try {
      const [category, created] = await Category.findOrCreate({
        where: { name: req.body.name.toLowerCase() },
      });

      if (created) {
        res.status(200).json({
          created,
          validation: `La nouvelle catégorie a bien été créée`,
        });
      } else if (category) {
        res
          .status(500)
          .json({ error: "Une catégorie portant ce nom existe déjà" })
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await Category.findByPk(req.params.categoryId);

      updatedCategory.set({
        name: req.body.name,
      });

      await updatedCategory.save();

      res.json({updatedCategory, validation: "La catégorie a bien été modifiée"});
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deletedCategory = await Category.findByPk(req.params.categoryId);
      await deletedCategory.destroy();
      res.json({deletedCategory, validation: "La catégorie a bien été supprimée"});
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },
};

module.exports = categoryController;
