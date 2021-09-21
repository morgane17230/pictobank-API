const { DataTypes, Model, STRING } = require("sequelize");
const sequelize = require("../database");

class Folder extends Model {}

Folder.init(
  {
    foldername: DataTypes.STRING,
    path: STRING,
    user_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "folder",
  }
);

module.exports = Folder;
