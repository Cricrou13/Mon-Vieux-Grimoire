const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user");
require("dotenv").config();
const bookRoutes = require("./routes/books");

const app = express();

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

// Middleware pour les CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// Middleware pour parser le JSON des requêtes
app.use(express.json());

app.use("/api/books", bookRoutes);

app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
