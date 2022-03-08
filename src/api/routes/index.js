"use strict";

// create App function
module.exports = function (app) {
  const dropController = require("../controllers/dropController");
  const collectionController = require("../controllers/collectionController");
  const collectionBattleController = require("../controllers/collectionBattleController");

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
    .get(collectionController.listCollections)
    .post(collectionController.createNewCollection);

  // put and delete request for /collections endpoints
  app
    .route("/collection/:id")
    .put(collectionController.updateCollection)
    .delete(collectionController.deleteCollection);

  // collectionBattleController Routes

  // get and post request for /collectionBattles endpoints
  app
    .route("/collectionBattles")
    .get(collectionBattleController.listCollectionBattles)
    .post(collectionBattleController.createNewCollectionBattle);

  // put and delete request for /collectionBattles endpoints
  app
    .route("/collectionBattle/:id")
    .put(collectionBattleController.updateCollectionBattle)
    .delete(collectionBattleController.deleteCollectionBattle);
};
