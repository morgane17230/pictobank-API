const User = require("./user.js");
const Folder = require("./folder.js");
const Picto = require("./picto");
const FolderHasPicto = require("./folder_has_picto");
const AccountHasFolder = require("./account_has_folder");
const Category = require("./category");
const Account = require('./account');

Account.hasMany(Picto, {
  as: "pictos",
  foreignKey: "account_id",
});

Picto.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id",
});

Category.hasMany(Picto, {
  as: "pictos",
  foreignKey: "category_id",
});

Picto.belongsTo(Category, {
  as: "category",
  foreignKey: "category_id",
});

Account.hasMany(User, {
  as: "users",
  foreignKey: "account_id",
});

User.belongsTo(Account, {
  as: "account",
  foreignKey: "account_id",
});

Folder.belongsToMany(Picto, {
  as: "pictos",
  through: FolderHasPicto,
  foreignKey: "folder_id",
  otherKey: "picto_id",
});

Picto.belongsToMany(Folder, {
  as: "folders",
  through: FolderHasPicto,
  foreignKey: "picto_id",
  otherKey: "folder_id",
});

Account.belongsToMany(Folder, {
  as: "folders",
  through: AccountHasFolder,
  foreignKey: "account_id",
  otherKey: "folder_id",
});

Folder.belongsToMany(Account, {
  as: "accounts",
  through: AccountHasFolder,
  foreignKey: "folder_id",
  otherKey: "account_id",
});

module.exports = {
  User,
  Picto,
  Folder,
  Category,
  Account
};
