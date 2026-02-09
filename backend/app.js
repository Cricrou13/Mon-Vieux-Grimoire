const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); // Pour lire le fichier .env

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

// Middleware pour gérer les erreurs de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise tout le monde
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware pour transformer le corps des requêtes en JSON (pour les futurs POST)
app.use(express.json());

app.use((req, res, next) => {
  res.status(200).json({ message: 'Serveur prêt et CORS configurés !' });
});

module.exports = app;