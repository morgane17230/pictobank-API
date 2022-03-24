const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Folder extends Model {}

Folder.init(
  {
    foldername: DataTypes.STRING,
    originalname: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.INTEGER,
    path: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "folder",
  }
);

module.exports = Folder;
