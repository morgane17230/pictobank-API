const User = require("./user.js");
const Folder = require("./folder.js");
const Picto = require("./picto");
const FolderHasPicto = require("./folder_has_picto");
const Category = require("./category");
const Organization = require('./organization');

Organization.hasMany(Picto, {
  as: "pictos",
  foreignKey: "org_id",
});

Picto.belongsTo(Organization, {
  as: "organization",
  foreignKey: "org_id",
});

Category.hasMany(Picto, {
  as: "pictos",
  foreignKey: "category_id",
});

Picto.belongsTo(Category, {
  as: "category",
  foreignKey: "category_id",
});

Organization.hasMany(Folder, {
  as: "folders",
  foreignKey: "org_id",
});

Folder.belongsTo(Organization, {
  as: "organization",
  foreignKey: "org_id",
});

Organization.hasMany(User, {
  as: "users",
  foreignKey: "org_id",
});

User.belongsTo(Organization, {
  as: "organization",
  foreignKey: "org_id",
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
  Organization
};
