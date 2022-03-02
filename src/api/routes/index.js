"use strict";

// create App function
module.exports = function (app) {
  const dropController = require("../controllers/dropController");
  const whitelistController = require("../controllers/whitelistController");

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

  // whitelistController Routes

  // get and post request for /whitelists endpoints
  app
    .route("/whitelists")
    .get(whitelistController.listWhitelists)
    .post(whitelistController.createNewWhitelist);

  // put and delete request for /whitelists endpoints
  app
    .route("/whitelist/:id")
    .put(whitelistController.updateWhitelist)
    .delete(whitelistController.deleteWhitelist);
};
