const { Folder } = require("../models");
const aws = require("aws-sdk");



const folderController = {
  createFolder: async (req, res) => {
    console.log(req.body);
    try {
      const [folder, created] = await Folder.findOrCreate({
        where: { foldername: req.body.foldername },
        defaults: {
          user_id: req.body.user_id,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.location,
        },
      });

      if (folder) {
        res.json("Ce nom de dossier existe déjà");
      } else {
        res.json(created);
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
};

module.exports = folderController;