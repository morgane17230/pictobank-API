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
      const pictos = await Picto.findAll();
      pictos ? res.json(pictos) : next();
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  getOnePicto: async (req, res, next) => {
    const s3 = new aws.S3();
    try {
      const picto = await Picto.findByPk(req.params.pictoId);
      const file = await s3.getSignedUrl("getObject", {
        Bucket: process.env.AWSBucket,
        Key: picto.originalname,
        ResponseContentDisposition: `attachment; filename="${picto.originalname}"`,
        Expires: 60 * 5,
      });
      res.json(file);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createPicto: (req, res) => {
    console.log(req.file);
    try {
      const newPictos = Picto.create({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.location,
      });
      res.status(200).json(newPictos);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  deletePicto: async (req, res) => {
    const s3 = new aws.S3();
    try {
      const deletedPicto = await Picto.findByPk(req.params.pictoId);
      s3.deleteObject(
        {
          Bucket: process.env.AWSBucket,
          Key: deletedPicto.originalname,
        },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log();
        }
      );
      await deletedPicto.destroy();
      res.json(deletedPicto);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },
};

module.exports = pictoController;
