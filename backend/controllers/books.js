/* eslint-disable no-underscore-dangle */

const fs = require("fs");
const Book = require("../models/Book");

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre précis (pour la page de détails)

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }
      res.status(200).json(book);
    })
    .catch(error => res.status(404).json({ error }));
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

// Supprimer un livre
exports.deleteBook = (req, res) => {
// On cherche d'abord le livre pour vérifier l'identité de l'utilisateur
  Book.findOne({ _id: req.params.id })
    .then((book) => {
    // Vérification : seul le propriétaire peut supprimer le livre
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        // On récupère le nom du fichier image
        const filename = book.imageUrl.split("/images/")[1];

        // On supprime d'abord le fichier du dossier /images
        fs.unlink(`images/${filename}`, () => {
          // Puis on supprime le livre dans la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Livre-supprimé" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

/* Fonction de notation */

exports.addRating = (req, res, next) => {
  if(req.body.rating < 0 || req.body.rating > 5) {
    return res.status(400).json({ message: "La note doit être entre 0 et 5"});
  }

  const ratingObject = {
    userId: req.auth.userId,
    grade: req.body.rating
  };

  Book.findOne({ _id: req.params.id})
    .then(book => {
      const userAlreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
      if(userAlreadyRated) {
        return res.status(400).json({ message: "Livre déjà noté"});
      }

    // Ajouter la nouvelle note au tableau
    book.ratings.push(ratingObject);

    // Recalculer la moyenne (averageRating)

    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, item) => sum + item.grade, 0);
      book.averageRating = parseFloat((sumRatings / totalRatings).toFixed(1));

    // Sauvegarder le livre mis à jour

    return book.save()
  
   .then(updateBook => res.status(200).json(updateBook))
   .catch(error => res.status(500).json({ error }));
  })
 };
/* Fonction de modification */

exports.modifyBook = (req, res, next) => {
  // On prépare l'objet qui va servir à la mise à jour

  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  // on supprime le _userId venant du front pour éviter que quelqu'un ne change le propriétaire
  delete bookObject._userId;

  // 2. On vérifie si c'est bien le propriétaire qui fait la modif
  Book.findOne({_id: req.params.id})
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non-autorisé'});
      } else {
        // Si on change l'image, on supprime l'ancienne du serveur
        if (req.file) {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log("Erreur lors de la suppression de l'ancienne image:", err);
          });
        }

        // 3. On met à jour le livre
        Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Livre modifié !'}))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};