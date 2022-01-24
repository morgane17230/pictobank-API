const bcrypt = require("bcrypt-promise");
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database");

class User extends Model {}

User.init(
  {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    org_id: DataTypes.INTEGER,
  },
  {
    defaultScope: {
      attributes: { exclude: ["password", "updated_at"] },
    },
    scopes: {
      pass: {
        attributes: { include: ["password", "updated_at"] },
      },
      nopass: {
        attributes: { exclude: ["password", "updated_at"] },
      },
    },

    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      },
    },
    sequelize,
    tableName: "user",
  }
);

User.prototype.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
