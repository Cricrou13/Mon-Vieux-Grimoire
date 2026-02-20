const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = (req, res) => {
  // On hache le mot de passe (10 tours de "sel")
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // On crée le nouvel utilisateur avec l'email du body et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // On enregistre dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
