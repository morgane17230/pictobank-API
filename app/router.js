const express = require("express");
const router = express.Router();
const sendMail = require("./middlewares/nodemailer");
const multerMid = require("./middlewares/multer-config.js");
const pictoController = require("./controllers/pictoController.js");
const userController = require("./controllers/userController");
const folderController = require("./controllers/folderController");
const categoryController = require("./controllers/categoryController");

// picto

router.get("/picto", pictoController.getAllPictos);
router.get("/picto/search/:query", pictoController.searchPictos);
router.get("/picto/:pictoId/download", pictoController.downloadPicto);
router.post("/picto", multerMid.uploadImages, pictoController.createPicto);
router.delete("/picto/:pictoId", pictoController.deletePicto);

// folder

router.get("/folder/:folderId", folderController.getFolder);
router.post(
  "/addFolder",
  multerMid.uploadAvatar,
  folderController.createFolder
);
router.put(
  "/folder/:folderId",
  multerMid.uploadAvatar,
  folderController.updateFolder
);
router.delete("/folder/:folderId", folderController.deleteFolder);
router.post(
  "/folder/:folderId/picto/:pictoId",
  folderController.addPictoToFolder
);
router.delete(
  "/folder/:folderId/picto/:pictoId",
  folderController.removePictoFromFolder
);

// user

router.get("/user", userController.getOnUser);
router.get("/user/:email", userController.getUserByMail);
router.post("/addUser", userController.createUser);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.put("/user/:userId", userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);

// category

router.get("/category", categoryController.getAllCategories);
router.get("/category/:categoryId", categoryController.getCategory);
router.post("/category", categoryController.createCategory);
router.put("/category/:categoryId", categoryController.updateCategory);
router.delete("/category/categoryId", categoryController.deleteCategory);

// nodemailer

router.post("/nodemailer", sendMail);

module.exports = router;
