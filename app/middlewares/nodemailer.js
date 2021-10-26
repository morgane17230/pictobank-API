const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { User } = require("../models");
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

  const { id, lastname, firstname, email, message, type } = req.body;
  
  let options = {};
  if (type === "contact" && lastname && firstname && message) {
    options = {
      from: email,
      to: process.env.smtpUser,
      subject: "Nouveau message du formulaire de contact sur Pikto",
      template: "contact",
      context: {
        firstname: firstname,
        lastname: lastname,
        email: message,
        message: message,
      },
    };
  } else if (type === "confirmRegister" && lastname && firstname && email) {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: `Votre compte a bien été créé`,
      template: "confirmRegister",
    };
  } else if ((type === "updateProfile", lastname && firstname && email)) {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: "Vous souhaitez mettre à jour votre profil",
      template: "updateProfile",
      context: {
        lastname: lastname,
        firstname: firstname,
        id: id,
      },
    };
  } else if (type === "resetPassword" && email) {
    let user = null;
    try {
      user = await User.findOne({
        where: {
          email: email,
        },
      });
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
    console.log(user);
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: `Vous avez oublié votre mot de passe`,
      template: "resetPassword",
      context: {
        userId: user.id,
      },
    };
  } else if (
    type === "confirmResetPassword" &&
    lastname &&
    firstname &&
    email
  ) {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: "Votre mot de passe a été mis à jour",
      template: "confirmResetPassword",
      context: {
        firstname: firstname,
        lastname: lastname,
        email: email,
      },
    };
  } else if (type === "confirmDelete" && email) {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: "Votre compte a bien été supprimé",
      template: "confirmDelete",
    };
  } else {
    console.log(req.body);
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
