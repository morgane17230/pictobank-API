const { User, Folder } = require("../models");
const aws = require("aws-sdk");



const folderController = {
  createFolder: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }

      let missingParams = [];
      if (!foldername) {
        missingParams.push("foldername");
      }

      if (missingParams.length > 0) {
        return res
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const [folder, created] = await Folder.findOrCreate({
        where: { foldername: req.body.foldername },
        defaults: {
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