const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Folder extends Model {}

Folder.init(
  {
    foldername: DataTypes.STRING,
    path: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "folder",
  }
);

module.exports = Folder;
