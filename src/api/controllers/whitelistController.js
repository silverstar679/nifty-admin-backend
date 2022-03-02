// import Whitelist Model
const Whitelist = require("../models/whitelistModel");

// DEFINE CONTROLLER FUNCTIONS

// listWhitelists function - To list drops
exports.listWhitelists = (req, res) => {
  const network = req.query.network;
  Whitelist.find({ network: network }, (err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(drop);
  });
};

// createNewWhitelist function - To create new drop
exports.createNewWhitelist = (req, res) => {
  let newWhitelist = new Whitelist(req.body);
  newWhitelist.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
};

// updateWhitelist function - To update drop status by id
exports.updateWhitelist = (req, res) => {
  Whitelist.findOneAndUpdate(
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

// deleteWhitelist function - To delete drop by id
exports.deleteWhitelist = (req, res) => {
  Whitelist.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Whitelist successfully deleted" });
  });
};
