const Panelist = require("../models/panelistModel");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

async function postPanelist(req, res) {
  //   let photoPanelist = "default.png";
  //   if (req.file) {
  //     photoPanelist = req.file.filename;
  //   }
  const {
    name,
    position,
    organization,
    email,
    phone,
    country,
    linkedIn,
    summary,
    check,
  } = req.body;
  try {
    const { originalname } = req.file; // Récupère le nom original
    const imageUrl = req.file.path; // URL de l'image Cloudinary
    const publicId = req.file.filename; // public_id dans Cloudinary (correspond au nom)

    const panelistExist = await Panelist.findOne({ email });
    if (panelistExist) {
      throw new Error("Panelist already exist");
    }
    //create panelist
    const panelist = await new Panelist({
      photo: imageUrl,
      photo_id: publicId,
      name,
      position,
      organization,
      email,
      phone,
      country,
      linkedIn,
      summary,
      check,
    });
    await panelist.save();
    res.status(201).json({
      message: "Panelist registered Successfully",
      data: panelist,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deletePanelist(req, res) {
  const id = req.params.id;
  try {
    // Récupérer le panelist à partir de MongoDB par ID
    const panelist = await Panelist.findById(id);

    if (!panelist) {
      return res.status(404).json({ message: "Panelist non trouvé" });
    }
    // Supprimer panelist de la base de données
    await Panelist.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(panelist.photo_id);
    res.status(200).json({ message: "panelist  supprimés avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de panelist" });
  }
}
async function getAllPanelist(req, res) {
  // n'oublie pas de mettre des filtre par date
  const { page = 1, limit = 10, search } = req.query;
  try {
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    const allPanelists = await Panelist.countDocuments();
    const tolalePanelists = await Panelist.countDocuments(searchQuery);
    const totalPages = Math.ceil(tolalePanelists / limit);
    const panelists = await Panelist.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Panelist fetched successfully",
      totale: tolalePanelists,
      totalPages,
      panelists,
      allPanelists,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
// async function updatePanelist(req, res) {
//   const id = req.params.id;
//   let photoPanelist = "";
//   if (req.file) {
//     photoPanelist = req.file.filename;
//   }
//   const {
//     name,
//     first_name,
//     gender,
//     date_of_birth,
//     classe,
//     address,
//     phone,
//     mail,
//     mother_name,
//     mother_occupation,
//     mother_phone,
//     father_name,
//     father_occupation,
//     father_phone,
//     submission,
//   } = req.body;

//   const query = { _id: id };
//   try {
//     const classFound = await Class.findOne({ level: classe });
//     if (!classFound) {
//       throw new Error("La classe n'existe pas");
//     }

//     // Récupérer l'étudiant actuel
//     const panelist = await Panelist.findById(id);
//     if (!panelist) {
//       return res.status(404).json({ message: "Étudiant introuvable" });
//     }
//     // Si une nouvelle photo est envoyée
//     if (req.file) {
//       photoPanelist = req.file.filename; // Attribuer le nom de la nouvelle photo
//       // Supprimer l'ancienne photo si elle n'est pas la photo par défaut
//       if (panelist.photo && panelist.photo !== "default.png") {
//         const oldPhotoPath = path.join(
//           __dirname,
//           "../public/img/panelists",
//           panelist.photo
//         );
//         fs.unlink(oldPhotoPath, (err) => {
//           if (err) {
//             console.error(
//               "Erreur lors de la suppression de l'ancienne photo:",
//               err
//             );
//           }
//         });
//       }
//     } else {
//       // Si aucune nouvelle photo n'est envoyée, garder l'ancienne photo
//       photoPanelist = panelist.photo;
//     }
//     await Panelist.findByIdAndUpdate(
//       query,
//       {
//         photo: photoPanelist,
//         name,
//         first_name,
//         gender,
//         date_of_birth,
//         classe: classFound._id,
//         address,
//         phone,
//         mail,
//         mother_name,
//         mother_occupation,
//         mother_phone,
//         father_name,
//         father_occupation,
//         father_phone,
//         submission,
//       },
//       { new: true, runValidators: true }
//     );
//   } catch (err) {
//     res.status(400).json({ message: err?.message });
//   }
//   res.status(200).json({ message: "La panelist est à jour avec success" });
// }
// async function getPanelistById(req, res) {
//   const id = req.params.id;
//   const panelist = await Panelist.findById(id).populate("classe");
//   if (!panelist) throw new Error("Panelist not found");
//   res.json({
//     status: "success",
//     message: "Panelist fetched successfully",
//     panelist,
//   });
// }
module.exports = {
  postPanelist,
  deletePanelist,
  getAllPanelist,
  //   updatePanelist,
  //   getPanelistById,
};
