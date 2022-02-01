"use strict";

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const DropSchema = new Schema({
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
  prizeDescription: {
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
  isFutureDrop: {
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
  threshold: {
    type: String,
    required: false,
  },
  previewMedia: {
    type: Object,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create and export model
module.exports = mongoose.model("drop", DropSchema);
