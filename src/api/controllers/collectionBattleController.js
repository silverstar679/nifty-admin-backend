// import CollectionBattle Model
const CollectionBattle = require("../models/collectionBattleModel");

// DEFINE CONTROLLER FUNCTIONS

// listCollectionBattles function - To list battles
exports.listCollectionBattles = (req, res) => {
  const network = req.query.network;
  CollectionBattle.find({ network: network }, (err, battle) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(battle);
  });
};

// createNewCollectionBattle function - To create new battle
exports.createNewCollectionBattle = (req, res) => {
  let newCollectionBattle = new CollectionBattle(req.body);
  newCollectionBattle.save((err, battle) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(battle);
  });
};

// updateCollectionBattle function - To update battle status by id
exports.updateCollectionBattle = (req, res) => {
  CollectionBattle.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, battle) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(battle);
    }
  );
};

// updateCollectionBattle function - To update battle status by id
exports.addTokenIds = async (req, res) => {
  const battle = await CollectionBattle.findOne({ _id: req.params.id });
  const update = { tokenIds: battle.tokenIds.concat(req.body.tokenIds) };

  CollectionBattle.findOneAndUpdate(
    { _id: req.params.id },
    { $set: update },
    { new: true },
    (err, battle) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(battle);
    }
  );
};

// deleteCollectionBattle function - To delete battle by id
exports.deleteCollectionBattle = (req, res) => {
  CollectionBattle.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "CollectionBattle successfully deleted" });
  });
};
