const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Category extends Model {}

Category.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "category",
  }
);

module.exports = Category;
