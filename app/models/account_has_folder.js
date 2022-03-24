const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class AccountHasFolder extends Model {}

AccountHasFolder.init(
  {
    folder_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "account_has_folder",
  }
);

module.exports = AccountHasFolder;