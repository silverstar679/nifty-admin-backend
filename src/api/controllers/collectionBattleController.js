// import CollectionBattle Model
const CollectionBattle = require("../models/collectionBattleModel");

// DEFINE CONTROLLER FUNCTIONS

// listCollectionBattles function - To list drops
exports.listCollectionBattles = (req, res) => {
  const network = req.query.network;
  CollectionBattle.find({ network: network }, (err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(drop);
  });
};

// createNewCollectionBattle function - To create new drop
exports.createNewCollectionBattle = (req, res) => {
  let newCollectionBattle = new CollectionBattle(req.body);
  newCollectionBattle.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
};

// updateCollectionBattle function - To update drop status by id
exports.updateCollectionBattle = (req, res) => {
  CollectionBattle.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    (err, drop) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(drop);
    }
  );
};

// deleteCollectionBattle function - To delete drop by id
exports.deleteCollectionBattle = (req, res) => {
  CollectionBattle.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "CollectionBattle successfully deleted" });
  });
};
