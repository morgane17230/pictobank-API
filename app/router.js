const express = require("express");
const router = express.Router();

const multerMid = require('./middleware/multer-config.js')
const pictoController = require("./controllers/pictoController.js");

router.get("/getPictos", pictoController.getAllPictos);
router.get("/getPicto/:pictoId", pictoController.getOnePicto);
router.post("/addPictos",multerMid.upload,  pictoController.createPicto);
router.delete("/deletePicto/:pictoId", pictoController.deletePicto);


module.exports = router;
