"use strict";

// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const WhitelistSchema = new Schema({
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
});

// create and export model
module.exports = mongoose.model("whitelist", WhitelistSchema);
