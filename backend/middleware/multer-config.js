const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// On stocke temporairement en mémoire pour que Sharp puisse traiter l'image
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(" ").join("_").split(".")[0];
  const filename = `${name}_${Date.now()}.webp`;

  // On s'assure que le dossier images existe
  if (!fs.existsSync("images")) {
    fs.mkdirSync("images");
  }

  try {
    await sharp(req.file.buffer)
      .resize(400, 600)
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(path.join("images", filename));

    req.file.filename = filename;
    return next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = { upload, optimizeImage };
