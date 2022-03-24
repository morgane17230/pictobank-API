const express = require("express");
const router = express.Router();
const sendMail = require("./services/nodemailer");
const generatePDF = require("./services/pdfGenerator");
const multerMid = require("./middlewares/multer-config.js");
const pictoController = require("./controllers/pictoController.js");
const userController = require("./controllers/userController");
const folderController = require("./controllers/folderController");
const categoryController = require("./controllers/categoryController");

// picto

router.get("/picto", pictoController.getAllPictos);
router.get("/picto/pdf", generatePDF);
router.post("/picto", multerMid.uploadImages, pictoController.createPicto);
router.delete("/picto/:pictoId", pictoController.deletePicto);
router.delete("/pictos/:AccountId", pictoController.deletePictos);

// folder

router.get("/folder/:folderId", folderController.getFolder);
router.get("/account/:accountId/folders", folderController.getFoldersByAccount);
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
router.post(
  "/folder/:folderId/account/:accountId",
  folderController.addFolderToAccount
);
router.delete(
  "/folder/:folderId/picto/:pictoId",
  folderController.removePictoFromFolder
);

router.delete(
  "/folder/:folderId/account/:accountId",
  folderController.removeFolderFromAccount
);

// user

router.get("/user", userController.getOneUser);
router.get("/user/:email", userController.getUserByMail);
router.post("/addUser", userController.createAccountAndUsers);
router.post("/login", userController.login);
router.put("/user/:userId", userController.updateUser);
router.delete("/account/:accountId", userController.deleteUser);

// category

router.get("/category", categoryController.getAllCategories);
router.post("/category", categoryController.createCategory);

// nodemailer

router.post("/nodemailer", sendMail);

module.exports = router;
