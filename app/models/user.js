const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class User extends Model {}

User.init(
  {
    lastname: DataTypes.TEXT,
    firstname: DataTypes.TEXT,
    email: DataTypes.TEXT,
    username: DataTypes.TEXT,
    password: DataTypes.TEXT,
    size: DataTypes.BIGINT,
  },
  {
    sequelize,
    tableName: "user",
  }
);

module.exports = User;
