"use strict";

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const CollectionSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  network: {
    type: String,
    required: false,
  },
  whitelist: {
    type: String,
    required: false,
  },
  isLive: {
    type: Boolean,
    default: false,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// create and export model
module.exports = mongoose.model("collection", CollectionSchema);
