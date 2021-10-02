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
        include: ['folders']
      });
      res.json(user);
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
        res.json({created, validation: 'Compte créé'});
      } else if (user) {
        res.json("Cet utilisateur existe déjà");
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

      const userId = parseInt(req.params.userId, 10);

      const user = await User.findByPk(userId, {
        include: ["folders"],
      });

      if (!user) {
        return res.status(404).json("User not found");
      }
      user.set(req.body);

      await user.save();
      res.json(user.get({ plain: true }));
    } catch (err) {
      console.trace(err);
      res.status(500).json(err.toString());
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json("User does not exist");
      }

      await user.destroy();
      res.json("Successfully deleted user");
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
        include: ["folders"],
      });

      if (!user) {
        return res.status(404).json("Cet utilisateur n'existe pas");
      }

      const passwordMatches = await user.validPassword(password);

      if (!passwordMatches) {
        return res.status(404).json("Mot de passe invalide");
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

  logout: async (req, res) => {
    console.log('logout')
  }
};

module.exports = UserController;
