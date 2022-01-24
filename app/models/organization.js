const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class Organization extends Model {}

Organization.init(
  {
    lastname: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "organization",
  }
);

module.exports = Organization;
