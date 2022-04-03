const { Category } = require("../models");
const generateContrast = require('../helpers/colors')

const categoryController = {
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
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`
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
          color: {"background": color, "text": generateContrast.contrast(color)}

        });
        res.status(200).json({
          category: newCategory,
          validation: `La nouvelle catégorie a bien été créée`,
        });
      }
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "La catégorie n'a pas pu être créée",
      });
    }
  }
};

module.exports = categoryController;
