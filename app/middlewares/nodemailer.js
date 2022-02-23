const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { Account, User } = require("../models");
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
    expires: 1494388182480,
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

  const { lastname, firstname, email, message, type, name, isOrganization } =
    req.body;

  let options = {};
  if (type === "contact" && lastname && firstname && message) {
    options = {
      from: email,
      to: process.env.smtpUser,
      subject: "Nouveau message du formulaire de contact sur Pikto",
      template: "contact",
      context: {
        firstname,
        lastname,
        message,
      },
    };
  } else if (type === "confirmRegister") {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: `La création de votre compte`,
      template: "confirmRegister",
      context: {
        lastname,
        firstname,
        email,
        name,
        isOrganization,
      },
    };
  } else if (type === "resetPassword" && email) {
    let user = null;
    try {
      const account = await Account.findOne({
        where: {
          email: email,
        },
      });
      user = await User.findOne({
        where: {
          account_id: account.id,
          role: "admin",
        },
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }

    options = {
      from: process.env.smtpUser,
      to: email,
      subject: `La réinitialisation de votre mot de passe`,
      template: "resetPassword",
      context: {
        user_id: user.id,
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
      subject: "La mise à jour de votre mot de passe",
      template: "confirmResetPassword",
      context: {
        firstname,
        lastname,
        email,
      },
    };
  } else if (type === "confirmDelete" && email) {
    options = {
      from: process.env.smtpUser,
      to: email,
      subject: "La suppression de votre compte",
      template: "confirmDelete",
    };
  } else {
    console.log("Type is missing");
    return;
  }

  transporter.sendMail(options, (error, _) => {
    if (error) {
      res.status(409).json({ error: "Le message n'a pas pu être envoyé" });
    } else {
      return res.json({ validation: "Le message a bien été envoyé" });
    }
  });
};

module.exports = sendMail;
