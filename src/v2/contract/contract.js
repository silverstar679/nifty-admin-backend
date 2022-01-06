"use strict";

const mongoose = require("mongoose");

const { GenerateRecordHistory } = require("../../utils");

/**
 * Account Level Enums
 * @type {[type]}
 */
const Network = Object.freeze({
  MAINNET: "MAINNET",
  RINKEBY: "RINKEBY",
  _: {
    code: {
      MAINNET: 0,
      RINKEBY: 1,
    },
    network: {
      0: "MAINNET",
      1: "RINKEBY",
    },
  },
});

const Schema = mongoose.Schema;

const schema = new Schema({
  address: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    required: true,
  },
  queueId: {
    type: Number,
    required: false,
  },
  polygonContractAddress: {
    type: String,
    required: false,
  },
  creator: {
    type: String,
    required: false,
  },
  artist: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  defaultMetadata: {
    type: String,
    required: false,
  },
  prizeMetadata: {
    type: String,
    required: false,
  },
  defaultNFTUri: {
    type: String,
    required: false,
  },
  isDefaultNFTImage: {
    type: Boolean,
    default: false,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  isDropEnded: {
    type: Boolean,
    default: false,
    required: false,
  },
  isBattleEnded: {
    type: Boolean,
    default: false,
    required: false,
  },
  dropDate: {
    type: Date,
    required: false,
  },
  extra: {
    type: Object,
    required: false,
  },
  record_history: {
    created_at: Date,
    updated_at: Date,
  },
});

// methods ======================
/**
 * get account level
 * @return {[type]} [description]
 */
schema.methods.networkParse = function () {
  return Network._.network[this.network];
};

/**
 * export
 * @return {[type]} [description]
 */
schema.methods.export = function () {
  const data = Object.assign({}, this.toJSON());

  delete data.__v;
  // data.network = this.networkParse();
  if (new Date(data.dropDate).getTime() > Date.now()) delete data.address;
  data.id = data._id;
  delete data._id;

  return data;
};

/**
 * Update
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
schema.methods.update = function (obj, res) {
  return new Promise(async (resolve, reject) => {
    if (obj.creator) this.creator = obj.creator;
    if (obj.artist) this.artist = obj.artist;
    if (obj.description) this.description = obj.description;
    if (obj.queueId) this.queueId = obj.queueId;
    if (obj.polygonContractAddress)
      this.polygonContractAddress = obj.polygonContractAddress;
    if (obj.defaultMetadata) this.defaultMetadata = obj.defaultMetadata;
    if (obj.prizeMetadata) this.prizeMetadata = obj.prizeMetadata;
    if (obj.defaultNFTUri) this.defaultNFTUri = obj.defaultNFTUri;
    if (obj.isDefaultNFTImage) this.isDefaultNFTImage = obj.isDefaultNFTImage;
    if (obj.type) this.type = obj.type;
    if (obj.isDropEnded) this.isDropEnded = obj.isDropEnded;
    if (obj.isBattleEnded) this.isBattleEnded = obj.isBattleEnded;
    if (obj.dropDate) this.dropDate = obj.dropDate;
    if (obj.extra) this.extra = obj.extra;
    if (res)
      this.record_history = GenerateRecordHistory(this.record_history, res);

    try {
      await this.save();

      return resolve(this);
    } catch (e) {
      return reject(e);
    }
  });
};

// statics ======================
/**
 * Create Account
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
schema.statics.create = function (obj, res) {
  return new Promise(async (resolve, reject) => {
    if (obj.address && obj.name && obj.network) {
      try {
        const contract = new this();

        contract.address = obj.address;
        contract.name = obj.name;
        contract.network = obj.network;
        // contract.network = Network._.code[obj.network.toUpperCase()];
        const update = await contract.update(obj, res);

        return resolve(update);
      } catch (e) {
        return reject(e);
      }
    } else {
      const e = new Error("address, name & network are required parameters");

      e.status = 406;
      reject(e);
    }
  });
};
/**
 * query
 * @param  {Object} [query={}] [description]
 * @return {[type]}            [description]
 */
schema.statics.query = function (query = {}) {
  return new Promise(async (resolve, reject) => {
    let { offset, limit, all, search, network, show_all, dropDate } = query;
    ["search", "offset", "limit", "all", "show_all"].forEach(
      (q) => delete query[q]
    );

    if (!show_all && !all && !dropDate) {
      query = Object.assign(query, {
        dropDate: {
          $lte: new Date(),
        },
      });
    }

    if (dropDate) query = Object.assign(query, { dropDate });
    if (network)
      query = Object.assign(query, {
        // network: Network._.code[network.toUpperCase()],
        network: network,
      });
    else query = Object.assign(query, { network: "mainnet" });

    if (search) {
      const regex = { $regex: search, $options: "i" };

      query = Object.assign(query, {
        $and: [
          {
            $or: [{ address: regex }, { name: regex }, { creator: regex }],
          },
        ],
      });
    }

    try {
      if (!all) {
        offset = !offset ? 0 : parseInt(offset);
        limit = !limit ? 10 : parseInt(limit);

        const total = await this.countDocuments(query);
        const results = await this.find(
          query,
          {},
          {
            skip: offset,
            limit,
            sort: { dropDate: -1 },
          }
        );

        const page = offset / limit;
        return resolve({
          results,
          paging: {
            offset,
            limit,
            total,
            page: offset / limit + 1,
            total_pages: Math.ceil(total / limit),
          },
        });
      }
      const results = await this.find(query, {}, { sort: { dropDate: -1 } });

      return resolve({ results });
    } catch (e) {
      return reject(e);
    }
  });
};

let CONTRACT;
try {
  CONTRACT = mongoose.model("CONTRACT");
} catch (error) {
  CONTRACT = mongoose.model("CONTRACT", schema);
}

CONTRACT.on("index", (e) => {
  if (e) console.error(e.message);
});

module.exports = CONTRACT;
