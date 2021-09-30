const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.smtpHost,
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.smtpUser,
    pass: process.env.passUser,
    clientId: process.env.clientId,
    clientSecret: process.env.clienSecret,
    refreshToken: process.env.refreshToken,
    accessToken: process.env.accessToken,
  },
});

const sendMail = async (req, res) => {
  if (!req.body) {
    return res.status(400).json("Missing body from request");
  }

  const { lastname, firstname, email, message, type } = req.body;

  let options = {};
  if (type === "contact") {
      options = {
        from: email,
        to: process.env.smtpUser,
        subject: `Nouveau message de ${firstname} ${lastname} sur Pikto`,
        html: `<p>${message}</p>`,
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
