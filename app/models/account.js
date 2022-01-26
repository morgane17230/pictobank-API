const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Account extends Model {}

Account.init(
  {
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.INTEGER,
    name: DataTypes.STRING,
    isOrganization: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "account",
  }
);

module.exports = Account;
