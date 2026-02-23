const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// On gère le cas où le plugin est importé comme un objet
userSchema.plugin(uniqueValidator.default || uniqueValidator);

module.exports = mongoose.model("User", userSchema);
