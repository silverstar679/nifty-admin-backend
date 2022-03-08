"use strict";

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema properties
const CollectionBattleSchema = new Schema({
  address: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  network: {
    type: String,
    required: false,
  },
  queueId: {
    type: String,
    required: false,
  },
  polygonContractAddress: {
    type: String,
    required: false,
  },
  prizeContractAddress: {
    type: String,
    required: false,
  },
  prizeTokenId: {
    type: Number,
    required: false,
  },
  tokenIds: {
    type: [Number],
    required: false,
  },
  battleStatus: {
    type: Number,
    default: false,
    required: false,
  },
  battleDate: {
    type: Date,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create and export model
module.exports = mongoose.model("collectionBattle", CollectionBattleSchema);