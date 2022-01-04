const { User } = require("../models");
const { jsonwebtoken } = require("../middlewares/jwt");
const jwt_decode = require("jwt-decode");

const UserController = {
  getOnUser: async (req, res) => {
    var token = req.headers.authorization;
    var decoded = jwt_decode(token);
    let user = null;
    try {
      user = await User.findByPk(decoded.userId, {
        include: [
          {
            association: "folders",
            include: ["pictos"],
          },
        ],
      });
      res.json(user);
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
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
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  createUser: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }

      const { lastname, firstname, email, username, password } = req.body;

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

      if (!username) {
        missingParams.push("username");
      }

      if (!password) {
        missingParams.push("password");
      }

      if (missingParams.length > 0) {
        return res
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const [user, created] = await User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          lastname,
          firstname,
          email,
          username,
          password,
        },
      });

      if (created) {
        res.json({ created, validation: "Votre compte a été créé" });
      } else if (user) {
        res.json({ error: "Un utilisateur avec ce nom existe déjà" });
      }
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  updateUser: async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json("Missing body from request");
      }
      const { lastname, firstname, email, username, password } = req.body;

      const userId = req.params.userId;

      const user = await User.findByPk(userId, {
        include: ["folders"],
      });

      if (!user) {
        return res.status(404).json("User not found");
      }

      if (lastname) {
        user.lastname = lastname;
      }

      if (firstname) {
        user.firstname = firstname;
      }

      if (username) {
        user.username = username;
      }

      if (email) {
        user.email = email;
      }

      if (password) {
        user.password = password;
      }

      await user.save();
      res.json({
        user: user.get({ plain: true }),
        validation: "Vos informations ont été mises à jour",
      });
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId);

      if (!user) {
        return res.status(404).json("User does not exist");
      }

      await user.destroy();
      res.json({ validation: "Votre compte a été supprimé" });
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
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
          .status(400)
          .json(`Missing body parameter(s): ${missingParams.join(", ")}`);
      }

      const user = await User.scope("pass").findOne({
        where: {
          username: username,
        },
        include: [
          {
            association: "folders",
            include: ["pictos"],
          },
        ],
      });

      if (!user) {
        res.status(404).json({error: "Un des identifiants est invalide"}).toString();
      }

      const passwordMatches = await user.validPassword(password);

      if (!passwordMatches) {
        res.status(404).json({error: "Un des identifiants est invalide"});
      }
      const jwtContent = { userId: user.id };
      const jwtOptions = {
        algorithm: "HS256",
        expiresIn: "2h",
      };

      res.json({
        ...user.get({ plain: true }),
        token: jsonwebtoken.sign(jwtContent, process.env.jwtSecret, jwtOptions),
      });
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },
};

module.exports = UserController;
