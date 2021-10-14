const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const path = require("path");

let transporter = nodemailer.createTransport({
  host: process.env.smtpHost,
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.smtpUser,
    pass: process.env.passUser,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken: process.env.refreshToken,
    accessToken: process.env.accessToken,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

const sendMail = async (req, res) => {
  if (!req.body) {
    return res.status(400).json("Missing body from request");
  }

  const { lastname, firstname, email, message, type } = req.body;

  let options = {};
  if (type === "contact" && lastname && firstname && message) {
      options = {
        from: email,
        to: process.env.smtpUser,
        subject: `Nouveau message du formulaire de contact sur Pikto`,
        template: "contact",
        context: {
          firstname: firstname,
          lastname: lastname,
          email: message,
          message: message,
        },
      };
  } else {
    console.log("Type is missing");
    return;
  }

  transporter.sendMail(options, (error, _) => {
    if (error) {
      return res.status(409).json(error.message);
    } else {
      return res.json("Email envoyé");
    }
  });
};

module.exports = sendMail;
