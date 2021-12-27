const User = require("./user.js");
const Folder = require("./folder.js");
const Picto = require("./picto");
const FolderHasPicto = require("./folder_has_picto");
const Category = require("./category");

User.hasMany(Picto, {
  as: "pictos",
  foreignKey: "user_id",
});

Picto.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

Category.hasMany(Picto, {
  as: "pictos",
  foreignKey: "category_id",
});

Picto.belongsTo(Category, {
  as: "category",
  foreignKey: "category_id",
});

User.hasMany(Folder, {
  as: "folders",
  foreignKey: "user_id",
});

Folder.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
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

module.exports = {
  User,
  Picto,
  Folder,
  Category,
};
