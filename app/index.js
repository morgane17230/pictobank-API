const dotenv = require("dotenv");
dotenv.config();
const router = require("./router");
const express = require("express");
const sanitizeBody = require("./middlewares/sanitize");
var cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use(sanitizeBody);
app.use(router);
app.use(function (err, req, res, next) {
  console.log("Ceci est le champ invalide ->", error.field);
  next(error);
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
