const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class FolderHasPicto extends Model {}

FolderHasPicto.init(
  {
    folder_id: DataTypes.INTEGER,
    picto_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "folder_has_picto",
  }
);

module.exports = FolderHasPicto;
