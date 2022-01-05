"use strict";

const mongoose = require("mongoose");

const { GenerateRecordHistory } = require("../../utils");

/**
 * Account Level Enums
 * @type {[type]}
 */
const Network = Object.freeze({
  MAINNET: "MAINNET",
  KOVAN: "KOVAN",
  RINKEBY: "RINKEBY",
  MATIC: "MATIC",
  MUMBAI: "MUMBAI",
  _: {
    code: {
      MAINNET: 0,
      KOVAN: 1,
      RINKEBY: 2,
      MATIC: 3,
      MUMBAI: 4,
    },
    network: {
      0: "MAINNET",
      1: "KOVAN",
      2: "RINKEBY",
      3: "MATIC",
      4: "MUMBAI",
    },
  },
});

const Schema = mongoose.Schema;

const schema = new Schema({
  address: {
    type: String,
    required: true,
  },
  abi: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  network: {
    type: Number,
    required: true,
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
  queueId: {
    type: Number,
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
  prizeNFTUri: {
    type: String,
    required: false,
  },
  isDefaultNFTImage: {
    type: Boolean,
    default: false,
    required: false,
  },
  isPrizeNFTImage: {
    type: Boolean,
    default: false,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  dropStatus: {
    type: Boolean,
    default: false,
    required: false,
  },
  battleStatus: {
    type: Boolean,
    default: false,
    required: false,
  },
  dropDate: {
    type: Date,
    required: false,
  },
  battleDate: {
    type: Date,
    required: false,
  },
  record_history: {
    created_at: Date,
    created_by: String,
    created_by_type: String,
    updated_at: Date,
    updated_by: String,
    updated_by_type: String,
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
  data.network = this.networkParse();
  if (new Date(data.battleDate).getTime() > Date.now()) delete data.address;
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
    if (obj.defaultMetadata) this.defaultMetadata = obj.defaultMetadata;
    if (obj.prizeMetadata) this.prizeMetadata = obj.prizeMetadata;
    if (obj.defaultNFTUri) this.defaultNFTUri = obj.defaultNFTUri;
    if (obj.prizeNFTUri) this.prizeNFTUri = obj.prizeNFTUri;
    if (obj.isDefaultNFTImage) this.isDefaultNFTImage = obj.isDefaultNFTImage;
    if (obj.isPrizeNFTImage) this.isPrizeNFTImage = obj.isPrizeNFTImage;
    if (obj.type) this.type = obj.type;
    if (obj.dropStatus) this.dropStatus = obj.dropStatus;
    if (obj.battleStatus) this.battleStatus = obj.battleStatus;
    if (obj.dropDate) this.dropDate = obj.dropDate;
    if (obj.battleDate) this.battleDate = obj.battleDate;
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
    if (obj.address && obj.name && obj.abi && obj.network) {
      try {
        const contract = new this();

        contract.address = obj.address;
        contract.name = obj.name;
        contract.abi = obj.abi;
        contract.network = Network._.code[obj.network.toUpperCase()];
        const update = await contract.update(obj, res);

        return resolve(update);
      } catch (e) {
        return reject(e);
      }
    } else {
      const e = new Error(
        "address, name, abi & network are required paramters"
      );

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
    let { offset, limit, all, search, network, show_all, battleDate } = query;
    ["search", "offset", "limit", "all", "show_all"].forEach(
      (q) => delete query[q]
    );

    if (!show_all && !all && !battleDate) {
      query = Object.assign(query, {
        battleDate: {
          $lte: new Date(),
        },
      });
    }

    if (battleDate) query = Object.assign(query, { battleDate });
    if (network)
      query = Object.assign(query, {
        network: Network._.code[network.toUpperCase()],
      });
    else query = Object.assign(query, { network: 0 });

    if (search) {
      const regex = { $regex: search, $options: "i" };

      query = Object.assign(query, {
        $and: [
          {
            $or: [
              { address: regex },
              { name: regex },
              { abi: regex },
              { creator: regex },
            ],
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
            sort: { battleDate: -1 },
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
      const results = await this.find(query, {}, { sort: { battleDate: -1 } });

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
