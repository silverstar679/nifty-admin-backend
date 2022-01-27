// import Drop Model
const Drop = require("../models/dropModel");

// DEFINE CONTROLLER FUNCTIONS

// listDrops function - To list drops
exports.listDrops = (req, res) => {
  const network = req.query.network;
  Drop.find({ network: network }, (err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(drop);
  });
};

// createNewDrop function - To create new drop
exports.createNewDrop = (req, res) => {
  let newDrop = new Drop(req.body);
  newDrop.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
};

// updateDrop function - To update drop status by id
exports.updateDrop = (req, res) => {
  Drop.findOneAndUpdate(
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

// deleteDrop function - To delete drop by id
exports.deleteDrop = (req, res) => {
  Drop.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Drop successfully deleted" });
  });
};
