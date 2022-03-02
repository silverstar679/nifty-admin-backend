"use strict";

// create App function
module.exports = function (app) {
  const whitelistController = require("../controllers/whitelistController");

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
