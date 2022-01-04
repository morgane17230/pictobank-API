const { Folder, Picto } = require("../models");
const aws = require("aws-sdk");

const folderController = {
  getFolder: async (req, res) => {
    try {
      const folder = await Folder.findByPk((req.params.folderId), {
        include: ['pictos']
      });
     res.json(folder);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
  createFolder: async (req, res) => {
    try {
      const newFolder = await Folder.create({
        foldername: req.body.foldername,
        user_id: req.body.user_id,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.location,
      });

      res.json(newFolder);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  updateFolder: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const updatedFolder = await Folder.findByPk(req.params.folderId);
      console.log(updatedFolder);
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

      const { foldername, user_id } = req.body;
      const { originalname, mimetype, size, location } = req.file

      if (foldername) {
          foldername
      }
      
      if (user_id) {
        user_id
      }

      if (originalname) {
        originalname
      }

      if (mimetype) {
        mimetype
      }

      if (size) {
        size
      }

      if (location) {
        location
      }

      updatedFolder.set({
        foldername,
        user_id,
        originalname,
        mimetype,
        size,
        path: location
      });

      await updatedFolder.save();

      res.json(updatedFolder);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
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
      res.json(deletedFolder);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  addPictoToFolder: async (req, res) => {
    try {
      const { pictoId, folderId } = req.params;

      let picto = await Picto.findByPk(pictoId);

      let folder = await Folder.findByPk(folderId);

      await folder.addPicto(picto);

      res.json({folder, validation: `Le picto a bien été ajouté au favoris ${folder.foldername}`});
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  removePictoFromFolder: async (req, res) => {
    const { pictoId, folderId } = req.params;
      console.log(req.body)
    try {
      
      let picto = await Picto.findByPk(pictoId);

      let folder = await Folder.findByPk(folderId);

      await folder.removePicto(picto);
     
      res.json(folder);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  }
};

module.exports = folderController;
