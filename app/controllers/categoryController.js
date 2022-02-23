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
      const { name } = req.body;

      let missingParams = [];

      if (!name) {
        missingParams.push("name");
      }

      if (missingParams.length > 0) {
        return res
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const category = await Category.findOne({
        where: { name: name.toLowerCase() },
      });

      if (category) {
        res
          .status(500)
          .json({ validation: "Une catégorie portant ce nom existe déjà" });
      } else {
        const newCategory = await Category.create({
          name,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        });
        res.status(200).json({
          category: newCategory,
          validation: `La nouvelle catégorie a bien été créée`,
        });
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  updateCategory: async (req, res) => {
    try {

      const { name } = req.body;

      const updatedCategory = await Category.findByPk(req.params.categoryId);

      if(name) {
        updatedCategory.name = name
      }

      await updatedCategory.save();

      res.json({
        updatedCategory,
        validation: "La catégorie a bien été modifiée",
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const deletedCategory = await Category.findByPk(req.params.categoryId);
      await deletedCategory.destroy();
      res.json({
        deletedCategory,
        validation: "La catégorie a bien été supprimée",
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },
};

module.exports = categoryController;
