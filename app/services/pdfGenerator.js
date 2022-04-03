const pdf = require("pdf-creator-node");
const { Picto } = require("../models");
var fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const aws = require("aws-sdk");

generatePDF = async (req, res) => {
  try {
    const pictos = await Picto.findAll({
      where: { id: req.query.collectedPictos },
      attributes: [
        `id`,
        `originalname`,
        `mimetype`,
        `size`,
        `path`,
        `category_id`,
        `account_id`,
      ],
      raw: true,
    });

    async function getObject(picto) {
      const s3 = new aws.S3();
      try {
        const params = {
          Bucket: process.env.AWSBucketIm,
          Key: picto.originalname,
        };

        const data = await s3.getObject(params).promise();
        const converted = await sharp(data.Body).png().toBuffer();
        const base64 = converted.toString("base64");
        const url = `data:image/png;base64,${base64}`;
        
        return url;
      } catch (e) {
        throw new Error(`Could not retrieve file from S3: ${e.message}`);
      }
    }

    const convertedPictos = await Promise.all(
      pictos.map(async (picto) => await getObject(picto))
    );

    var html = fs.readFileSync(
      path.resolve(__dirname, "../views/template.html"),
      "utf8"
    );

    var options = {
      format: "A4",
      orientation: "portrait",
      footer: {
        height: "20mm",
        contents: {
          default:
            '<span style="color: #444; font-size: 10px">{{page}}</span><span style="font-size: 10px">/{{pages}}</span>',
        },
      },
    };

    var document = {
      html: html,
      data: {
        pictos: convertedPictos,
      },
      type: "buffer",
    };

    pdf
      .create(document, options)
      .then((file) => {
        res.set({
          "Content-Type": "application/pdf",
          "Content-Length": file.length,
        });
        res.send(file);
      })
      .catch((error) => {
        res.status(500).json({ validation: "impossible de créer un PDF" });
      });
  } catch (error) {
    console.trace(error);
    res.status(500).json(error.toString());
  }
};

module.exports = generatePDF;
