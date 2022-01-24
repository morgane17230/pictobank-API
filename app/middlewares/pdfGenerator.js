const pdf = require("pdf-creator-node");
const { Picto } = require("../models");
var fs = require("fs");
const path = require("path");

let pictos = [];

generatePDF = async (req, res) => {
  try {
    pictos = await Picto.findAll({
      where: { id: req.query.collectedPictos },
      attributes: [
        `id`,
        `originalname`,
        `mimetype`,
        `size`,
        `path`,
        `category_id`,
        `org_id`,
      ],
      raw: true,
    });

    var html = fs.readFileSync(
      path.resolve(__dirname, "../views/template.html"),
      "utf8"
    );
    var options = {
      format: "A4",
      orientation: "portrait",
      footer: {
        height: "10mm",
        contents: {
          default: `<span style="color: #444;>{{page}}</span>/<span>{{pages}}</span>`,
        },
      },
    };

    var document = {
      html: html,
      data: {
        pictos: pictos,
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
        console.log(file);
        console.log(pictos);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.trace(error);
    res.status(500).json(error.toString());
  }
};

module.exports = generatePDF;
