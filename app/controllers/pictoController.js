const { Picto } = require("../models");
const aws = require("aws-sdk");

aws.config.update({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: process.env.AWSRegion,
});

const pictoController = {
  getAllPictos: async (_, res, next) => {
    try {
      const pictos = await Picto.findAll({
        order: [["originalname", "ASC"]],
      });
      pictos ? res.json(pictos) : next();
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createPicto: async (req, res) => {
    try {
      const newPictos = await Picto.create({
        account_id: req.body.account_id,
        category_id: req.body.category_id,
        originalname: req.body.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.location,
      });
      res.status(200).json({ newPictos, validation: "Picto(s) ajouté(s)" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  deletePicto: async (req, res) => {
    const s3 = new aws.S3();

    try {
      const deletedPicto = await Picto.findByPk(req.params.pictoId);
      s3.deleteObject(
        {
          Bucket: process.env.AWSBucketIm,
          Key: deletedPicto.originalname,
        },
        function (err, _) {
          if (err) console.log(err, err.stack);
          else console.log();
        }
      );
      await deletedPicto.destroy();
      res.json({ deletedPicto, validation: "Le picto a bien été supprimé" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  deletePictos: async (req, res) => {
    const s3 = new aws.S3();

    try {
      const deletedPictos = await Picto.findAll({
        where: { account_id: req.params.accountId },
      });
      deletedPictos.forEach(async (deletedPicto) => {
        s3.deleteObject(
          {
            Bucket: process.env.AWSBucketIm,
            Key: deletedPicto.originalname,
          },
          function (err, _) {
            if (err) console.log(err, err.stack);
            else console.log();
          }
        );
        await deletedPicto.destroy();
      });
      res.json({
        deletedPictos,
        validation: "Vos pictos ont bien été supprimés",
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },
};

module.exports = pictoController;
