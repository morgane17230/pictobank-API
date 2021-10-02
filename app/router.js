
const express = require("express");
const router = express.Router();
const sendMail = require("./middlewares/nodemailer");
const multerMid = require('./middlewares/multer-config.js');
const pictoController = require("./controllers/pictoController.js");
const userController = require("./controllers/userController");
const folderController = require('./controllers/folderController');


router.get("/getPictos", pictoController.getAllPictos);
router.get("/getPictos/search/:query", pictoController.searchPictos)
router.get("/getPicto/:pictoId/download", pictoController.downloadPicto);
router.post("/addPictos",multerMid.uploadImages,  pictoController.createPicto);
router.delete("/deletePicto/:pictoId", pictoController.deletePicto);


router.post(
  "/addFolder",
  multerMid.uploadAvatar,
  folderController.createFolder
);

router.get("/user", userController.getOnUser);
router.post("/addUser", userController.createUser)
router.post("/login", userController.login)
router.post("/logout", userController.logout);

router.post("/contact", sendMail);


module.exports = router;
