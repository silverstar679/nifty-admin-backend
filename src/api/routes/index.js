"use strict";

// create App function
module.exports = function (app) {
  const dropController = require("../controllers/dropController");
  const collectionController = require("../controllers/collectionController");

  // dropController Routes

  // get and post request for /drops endpoints
  app
    .route("/drops")
    .get(dropController.listDrops)
    .post(dropController.createNewDrop);

  // put and delete request for /drops endpoints
  app
    .route("/drop/:id")
    .put(dropController.updateDrop)
    .delete(dropController.deleteDrop);

  // collectionController Routes

  // get and post request for /collections endpoints
  app
    .route("/collections")
    .get(collectionController.listWhitelists)
    .post(collectionController.createNewWhitelist);

  // put and delete request for /collections endpoints
  app
    .route("/collection/:id")
    .put(collectionController.updateWhitelist)
    .delete(collectionController.deleteWhitelist);
};
