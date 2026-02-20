const express = require("express");

const router = express.Router();
const userCtrl = require("../controllers/user");

// La route demandée par le frontend pour l'inscription
router.post("/signup", userCtrl.signup);

module.exports = router;
