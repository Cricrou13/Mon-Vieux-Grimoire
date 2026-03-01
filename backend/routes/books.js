const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth"); // Ne pas oublier l'auth !
const booksCtrl = require("../controllers/books");
const { upload, optimizeImage } = require("../middleware/multer-config");

// Route pour récupérer tous les livres (Public)
router.get("/", booksCtrl.getAllBooks);

// Route pour les 3 meilleurs livres (Public) - Doit être AVANT la route :id
router.get("/bestrating", booksCtrl.getBestRating);

// Route pour un livre spécifique (Public)
router.get("/:id", booksCtrl.getOneBook);

// Route pour créer un livre (Privé + Image)
router.post("/", auth, upload, optimizeImage, booksCtrl.createBook);

module.exports = router;
