const express = require("express");

const router = express.Router();

const booksCtrl = require("../controllers/books");

// On définit la route GET pour tous les livres
router.get("/", booksCtrl.getAllBooks);

module.exports = router;
