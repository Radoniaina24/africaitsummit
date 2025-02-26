const mongoose = require("mongoose");
// Modèle Étudiant
const panelistSchema = new mongoose.Schema(
  {
    photo: { type: String, require: true },
    photo_id: { type: String, require: true },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // Empêche les emails dupliqués

      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    linkedIn: { type: String, trim: true },
    summary: { type: String, trim: true },
    check: { type: String, required: true },
  },
  { timestamps: true } // Ajoute createdAt & updatedAt automatiquement);
);
const Panelist = mongoose.model("Panelist", panelistSchema);
module.exports = Panelist;
