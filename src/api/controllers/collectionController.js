// import Collection Model
const Collection = require("../models/collectionModel");

// DEFINE CONTROLLER FUNCTIONS

// listCollections function - To list drops
exports.listCollections = (req, res) => {
  const network = req.query.network;
  Collection.find({ network: network }, (err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(drop);
  });
};

// createNewCollection function - To create new drop
exports.createNewCollection = (req, res) => {
  let newCollection = new Collection(req.body);
  newCollection.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
};

// updateCollection function - To update drop status by id
exports.updateCollection = (req, res) => {
  Collection.findOneAndUpdate(
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

// deleteCollection function - To delete drop by id
exports.deleteCollection = (req, res) => {
  Collection.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Collection successfully deleted" });
  });
};
