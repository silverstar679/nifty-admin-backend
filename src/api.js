"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const https = require("https")
// Import DB Connection
require("./config/db");

// Import DB Model
const Drop = require("./models/dropModel");
const Collection = require("./models/collectionModel");
const CollectionBattle = require("./models/collectionBattleModel");

// create express app
const app = express();
const router = express.Router();

router.get("/drops/", function (req, res) {
  const network = req.query.network;
  const polygonNetwork = req.query.polygonNetwork;
  Drop.find(
    { network: network, polygonNetwork: polygonNetwork },
    (err, drop) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(drop);
    }
  );
});

router.post("/drops/", function (req, res) {
  let newDrop = new Drop(req.body);
  newDrop.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
});

router.put("/drop/:id/", function (req, res) {
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
});

router.delete("/drop/:id/", function (req, res) {
  Drop.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Drop successfully deleted" });
  });
});

router.get("/collections/", function (req, res) {
  const network = req.query.network;
  Collection.find({ network: network }, (err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(drop);
  });
});

router.post("/collections/", function (req, res) {
  let newCollection = new Collection(req.body);
  newCollection.save((err, drop) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(drop);
  });
});

router.put("/collection/:id/", function (req, res) {
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
});

router.delete("/collection/:id/", function (req, res) {
  Collection.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "Collection successfully deleted" });
  });
});

router.get("/collectionBattles/", function (req, res) {
  const network = req.query.network;
  CollectionBattle.find({ network: network }, (err, battle) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(battle);
  });
});

router.post("/collectionBattles/", function (req, res) {
  let newCollectionBattle = new CollectionBattle(req.body);
  newCollectionBattle.save((err, battle) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(battle);
  });
});

router.put("/collectionBattle/:id/", function (req, res) {
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
});

router.delete("/collectionBattle/:id/", function (req, res) {
  CollectionBattle.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(404).send(err);
    }
    res.status(200).json({ message: "CollectionBattle successfully deleted" });
  });
});

router.get("/opensea/orders/", async (req, res, next) => {
  try {
    const network = req.query.network;
    const address = req.query.address;
    const tokenIds = req.query.tokenIds;
    const tokenIdsArr = tokenIds.split(",");
    let url = `https://${network}api.opensea.io/wyvern/v1/orders?asset_contract_address=${address}&order_direction=desc&limit=30`;
    for (let i = 0; i < tokenIdsArr.length; i++) {
      url += `&token_ids=${tokenIdsArr[i]}`;
    }
    const options =
      network !== "testnets-"
        ? {
            headers: {
              "X-API-KEY": "0e1bf05b31b84741beb801f347e6e30a",
            },
          }
        : {};

    let dataString = "";
    const response = await new Promise((resolve, reject) => {
      const req = https.get(url, options, function (res) {
        res.on("data", (chunk) => {
          dataString += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(dataString));
        });
      });

      req.on("error", (e) => {
        reject({
          statusCode: 500,
          body: "Something went wrong!",
        });
      });
    });
    res.status(200).json(response);

    // return new Promise((resolve, reject) => {
    //   resolve({
    //     statusCode: 200,
    //     headers: {
    //       "Access-Control-Allow-Headers": "Content-Type",
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Methods": "GET,OPTIONS",
    //     },
    //     body: JSON.stringify(response, null, 4),
    //   });
    // });
  } catch (errors) {
    return next(errors);
  }
});

app
  .use(cors())
  .use((req, res, next) => {
    res
      .header("Access-Control-Allow-Origin", "*")
      .header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE, PATCH"
      )
      .header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      )
      .header("Access-Control-Allow-Credentials", true);
    next();
  })
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json()) // support json encoded bodies
  .use("/.netlify/functions/api", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
