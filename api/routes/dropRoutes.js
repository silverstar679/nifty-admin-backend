"use strict";

// create App function
module.exports = function (app) {
  const dropController = require("../controllers/dropController");

  // dropController Routes

  // get and post request for /drops endpoints
  app
    .route("/drops")
    .get(dropController.listAllDrops)
    .post(dropController.createNewDrop);

  // put and delete request for /drops endpoints
  app
    .route("/drop/:id")
    .put(dropController.updateDrop)
    .delete(dropController.deleteDrop);
};
