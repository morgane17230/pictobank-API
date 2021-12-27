const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Picto extends Model {}

Picto.init(
  {
    originalname: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
    path: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "picto",
  }
);

module.exports = Picto;
