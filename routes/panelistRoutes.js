const asyncHandler = require("express-async-handler");
const express = require("express");
const panelistRoutes = express.Router();
const panelistContollers = require("../controllers/panelistController");
const uploadPanelistPhoto = require("../utils/cloudinary");

panelistRoutes.get("/", asyncHandler(panelistContollers.getAllPanelist));
// panelistRoutes.get("/:id", asyncHandler(panelistContollers.getPanelistById));
panelistRoutes.post(
  "/register",
  uploadPanelistPhoto,
  //   panelistContollers.resizePanelistPhoto,
  asyncHandler(panelistContollers.postPanelist)
);
// panelistRoutes.put(
//   "/update/:id",
//   panelistContollers.uploadPanelistPhoto,
//   panelistContollers.resizePanelistPhoto,
//   asyncHandler(panelistContollers.updatePanelist)
// );
panelistRoutes.delete(
  "/delete/:id",
  asyncHandler(panelistContollers.deletePanelist)
);

module.exports = panelistRoutes;
