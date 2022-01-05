"use strict";

const express = require("express");

/**
 * Router object
 */
const router = express.Router();

/**
 * Contract
 * @type {[type]}
 */
router.use("/contract", require("./contract"));

module.exports = router;
