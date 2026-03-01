/* eslint-disable no-underscore-dangle */

const Book = require("../models/Book");

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre précis (pour la page de détails)

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer les 3 livres les mieux notés (exigé par le front)

exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie par note décroissante
    .limit(3) // Prend les 3 premiers
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Créer un nouveau livre

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // ID venant du token via le middleware auth
    imageUrl:
  `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });

  book.save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
