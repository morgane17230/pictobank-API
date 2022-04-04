const { Folder, Picto, Account } = require("../models");
const aws = require("aws-sdk");

const folderController = {
  getFolder: async (req, res) => {
    try {
      const folder = await Folder.findByPk(req.params.folderId, {
        include: ["pictos"],
      });
      res.json(folder);
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  getFoldersByAccount: async (req, res) => {
    try {
      const folders = await Folder.findAll({
        include: [
          {
            association: "accounts",
            where: {
              id: req.params.accountId,
            },
          },
        ],
      });
      res.json(folders);
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  createFolder: async (req, res) => {
    try {
      let missingParams = [];

      if (!req.file) {
        missingParams.push("file");
      }

      if (req.body === {}) {
        missingParams.push("foldername");
      }

      if (missingParams.length > 0) {
        return res
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const newFolder = await Folder.create({
        foldername: req.body.foldername,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.location,
      });

      const account = await Account.findByPk(req.body.account_id);

      await account.addFolder(newFolder);

      res.json({ newFolder, message: "Le dossier a bien été créé" });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  updateFolder: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const updatedFolder = await Folder.findByPk(req.params.folderId, {
        include: ["pictos"],
      });

      const { foldername } = req.body;

      if (foldername) {
        updatedFolder.foldername = foldername;
      }

      if (req.file) {
        s3.deleteObject(
          {
            Bucket: process.env.AWSBucketAv,
            Key: `${updatedFolder.originalname.split('.')[0]}.webp`,
          },
          function (err, _) {
            if (err) console.log(err, err.stack);
            else console.log();
          }
        );
      }

      if (req.file) {
        updatedFolder.originalname = req.file.originalname;
        updatedFolder.mimetype = req.file.mimetype;
        updatedFolder.path = req.file.location;
        updatedFolder.size = req.file.size;
      }

      await updatedFolder.save();

      res.json({ updatedFolder, message: "Le dossier a été modifié" });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  deleteFolder: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const deletedFolder = await Folder.findByPk(req.params.folderId);

      s3.deleteObject(
        {
          Bucket: process.env.AWSBucketAv,
          Key: `${deletedFolder.originalname.split('.')[0]}.webp`,
        },
        function (err, _) {
          if (err) console.log(err, err.stack);
          else console.log();
        }
      );
      await deletedFolder.destroy();
      res.json({ deletedFolder, message: "Le dossier a bien été supprimé" });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  addPictoToFolder: async (req, res) => {
    try {
      const { pictoId, folderId } = req.params;

      let picto = await Picto.findByPk(pictoId);

      let folder = await Folder.findByPk(folderId);

      await folder.addPicto(picto);

      res.json({
        folder,
        message: `Le picto a bien été ajouté au favoris ${folder.foldername}`,
      });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  removePictoFromFolder: async (req, res) => {
    const { pictoId, folderId } = req.params;

    try {
      let picto = await Picto.findByPk(pictoId);

      let folder = await Folder.findByPk(folderId);

      await folder.removePicto(picto);

      res.json({
        folder,
        message: `Le picto a bien été retiré du favoris ${folder.foldername}`,
      });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  addFolderToAccount: async (req, res) => {
    const { accountId, folderId } = req.params;

    try {
      let account = await Account.findByPk(accountId);

      let folder = await Folder.findByPk(folderId);

      await account.addPicto(folder);

      res.json({
        account,
        message: `Le dossier ${folder.foldername} a bien été ajouté au compte ${account.username}`,
      });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },

  removeFolderFromAccount: async (req, res) => {
    const { accountId, folderId } = req.params;

    try {
      let account = await Account.findByPk(accountId);

      let folder = await Folder.findByPk(folderId);

      await account.removePicto(folder);

      res.json({
        account,
        message: `Le dossier ${folder.foldername} a bien été supprimé du compte ${account.username}`,
      });
    } catch (error) {
      console.trace(error);
      return res.status(500).json({
        message: "Une erreur est survenue",
      });
    }
  },
};

module.exports = folderController;
