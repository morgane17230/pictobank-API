const dotenv = require("dotenv");
dotenv.config();
const router = require("./router");

const express = require("express");
var cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use(router);
app.use(function (err, req, res, next) {
  console.log("Ceci est le champ invalide ->", err.field);
  next(err);
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
