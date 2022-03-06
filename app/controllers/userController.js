const { User, Account, Picto } = require("../models");
const passwordGenerator = require("../helpers/password");
const sendMail = require("../services/nodemailer");
const { jsonwebtoken } = require("../middlewares/jwt");
const jwt_decode = require("jwt-decode");

const UserController = {
  getOneUser: async (req, res) => {
    var token = req.headers.authorization;
    var decoded = jwt_decode(token);
    let user = null;
    try {
      user = await User.findByPk(decoded.userId, {
        include: [
          {
            association: "account",
            include: [
              {
                association: "folders",
                include: ["pictos"],
              },
              {
                association: "pictos",
              },
              {
                association: "users",
              },
            ],
          },
        ],
      });
      res.json(user);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  getUserByMail: async (req, res) => {
    let user = null;
    try {
      user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });
      const jwtContent = { userMail: req.params.email };
      const jwtOptions = {
        algorithm: "HS256",
        expiresIn: "2h",
      };

      res.send({
        ...user.get({ plain: true }),
        token: jsonwebtoken.sign(jwtContent, process.env.jwtSecret, jwtOptions),
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createAccountAndUsers: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }

      const { lastname, firstname, email, name, password, isOrganization } =
        req.body;

      let missingParams = [];
      if (!lastname) {
        missingParams.push("lastname");
      }

      if (!firstname) {
        missingParams.push("firstname");
      }

      if (!email) {
        missingParams.push("email");
      }

      if (!name) {
        missingParams.push("name");
      }

      if (!password) {
        missingParams.push("password");
      }

      if (missingParams.length > 0) {
        return res
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const [account, created] = await Account.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          lastname: lastname.toUpperCase(),
          firstname: firstname.toLowerCase(),
          email,
          isOrganization,
          name: name.toUpperCase(),
        },
      });

      if (created) {
        if (isOrganization) {
          await User.create({
            username: `${account.name.toLowerCase()}-admin`,
            password,
            account_id: account.id,
            role: "admin",
          });

          await User.create({
            username: `${account.name.toLowerCase()}-team`,
            password: passwordGenerator(),
            account_id: account.id,
            role: "user",
          });
        } else {
          await User.create({
            username: `${account.name}`,
            password,
            account_id: account.id,
            role: "admin",
          });
        }

        sendMail({
          body: {
            type: "confirmRegister",
            lastname: lastname.toUpperCase(),
            firstname: firstname.toLowerCase(),
            email,
            isOrganization,
            name: name.toLowerCase(),
          },
        });

        res.json({
          created,
          validation:
            "Votre compte a bien été créé et un message de confirmation vous a été envoyé",
        });
      } else if (account) {
        res.json({ validation: "Un utilisateur avec ce nom existe déjà" });
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  updateUser: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }
      const { lastname, firstname, email, name, password, teamPassword } =
        req.body;

      const user = await User.findByPk( req.params.userId, {
        where: {
          role: "admin",
        },
        include: [
          {
            association: "account",
            include: [
              {
                association: "folders",
                include: ["pictos"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json("User not found");
      }

      const account = await Account.findOne({
        where: {
          id: user.account_id,
        },
      });

      const team = await User.findOne({
        where: {
          account_id: account.id,
          role: "user",
        },
      });

      if (!account) {
        return res.status(404).json("User not found");
      }

      if (lastname) {
        account.lastname = lastname.toUpperCase();
      }

      if (firstname) {
        account.firstname = firstname.toLowerCase();
      }

      if (name) {
        if (account.isOrganization) {
          account.name = name.toUpperCase();
          team.username = `${account.name.toLowerCase()}-team`;
          user.username = `${account.name.toLowerCase()}-team`;
        } else {
          account.name = name.toUpperCase();
          user.username = account.name;
        }
      }

      if (email) {
        account.email = email;
      }

      if (password) {
        user.password = password;
        await user.save({
          password,
        });
      }

      if (teamPassword) {
        team.password = teamPassword;
        await team.save({
          password: teamPassword,
        });
      }

      await account.save({
        lastname,
        firstname,
        name,
        email,
      });

      res.json({
        user,
        validation: "Vos informations ont été mises à jour",
      });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const pictos = await Picto.findAll({
        where: {
          account_id: req.params.accountId,
        },
      });

      const owner = await User.findOne({
        where: {
          role: "isOwner",
        },
      });

      pictos.forEach(async (picto) => {
        picto.account_id = owner.account_id;
        await picto.save();
      });

      const account = await Account.findByPk(req.params.accountId, {
        include: "pictos",
      });

      if (account) {
        await account.destroy();
        sendMail({
        body: {
          type: "confirmDelete",
          lastname: account.lastname,
          firstname: account.firstname,
          email: account.email
        },
      });
      } else {
        res.status(404).json("Account does not exist");
      }


      res.json({ validation: "Votre compte a été supprimé, une confirmation vous a été envoyée" });
    } catch (error) {
      console.trace(error);
      res.status(500).json(error, { error: "Une erreur s'est produite" });
    }
  },

  login: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }

      const { username, password } = req.body;

      let missingParams = [];
      if (!username) {
        missingParams.push("username");
      }

      if (!password) {
        missingParams.push("password");
      }

      if (missingParams.length > 0) {
        return res
          .status(404)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const user = await User.scope("pass").findOne({
        where: {
          username: username,
        },
      });

      if (user) {
        const passwordMatches = user.validPassword(password);

        if (!passwordMatches) {
          res.json({ validation: "Un des identifiants est invalide" });
        }
        const jwtContent = { userId: user.id };
        const jwtOptions = {
          algorithm: "HS256",
          expiresIn: "2h",
        };

        res.json({
          ...user.get({ plain: true }),
          token: jsonwebtoken.sign(
            jwtContent,
            process.env.jwtSecret,
            jwtOptions
          ),
        });
      } else {
        res.json({ validation: "Un des identifiants est invalide" });
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json({ error: "Une erreur s'est produite" });
    }
  },
};

module.exports = UserController;
