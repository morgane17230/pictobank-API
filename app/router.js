const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
    res.send('le router fonctionne')
});

module.exports = router;
