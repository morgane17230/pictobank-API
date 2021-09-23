const express = require("express");
const router = express.Router();

const multerMid = require('./middleware/multer-config.js')
const pictoController = require("./controllers/pictoController.js");

router.get("/getPictos", pictoController.getAllPictos);
router.get("/getPictos/search/:query", pictoController.searchPictos)
router.get("/getPicto/:pictoId/download", pictoController.downloadPicto);
router.post("/addPictos",multerMid.upload,  pictoController.createPicto);
router.delete("/deletePicto/:pictoId", pictoController.deletePicto);


module.exports = router;
