const { Folder, Picto } = require("../models");
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
      res.status(500).json(error.toString());
    }
  },

  getFoldersByOrg: async (req, res) => {
    try {
      const folders = await Folder.findAll({
        where: {
          org_id: req.params.orgId,
        },
      });
      res.json(folders);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createFolder: async (req, res) => {
    try {
      const newFolder = await Folder.create({
        foldername: req.body.foldername,
        org_id: req.body.org_id,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.location,
      });

      res.json({ newFolder, validation: "Le dossier a bien été créé" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },

  updateFolder: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const updatedFolder = await Folder.findByPk(req.params.folderId);

      const { foldername, org_id } = req.body;

      if (foldername) {
        foldername;
      }

      if (org_id) {
        org_id;
      }

      if (req.file) {
        s3.deleteObject(
          {
            Bucket: process.env.AWSBucketAv,
            Key: updatedFolder.originalname,
          },
          function (err, _) {
            if (err) console.log(err, err.stack);
            else console.log();
          }
        );

        updatedFolder.set({
          foldername,
          org_id,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.location,
        });
      }

      updatedFolder.set({
        foldername,
        org_id,
      });

      await updatedFolder.save();

      res.json({ updatedFolder, validation: "Le dossier a été modifié" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },

  deleteFolder: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const deletedFolder = await Folder.findByPk(req.params.folderId);
      s3.deleteObject(
        {
          Bucket: process.env.AWSBucketAv,
          Key: deletedFolder.originalname,
        },
        function (err, _) {
          if (err) console.log(err, err.stack);
          else console.log();
        }
      );
      await deletedFolder.destroy();
      res.json({ deletedFolder, validation: "Le dossier a bien été supprimé" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
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
        validation: `Le picto a bien été ajouté au favoris ${folder.foldername}`,
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },

  removePictoFromFolder: async (req, res) => {
    const { pictoId, folderId } = req.params;
    console.log(req.body);
    try {
      let picto = await Picto.findByPk(pictoId);

      let folder = await Folder.findByPk(folderId);

      await folder.removePicto(picto);

      res.json({folder, validation: `Le picto a bien été retiré du favoris ${folder.foldername}`});
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, {error: "Une erreur s'est produite"});
    }
  },
};

module.exports = folderController;
