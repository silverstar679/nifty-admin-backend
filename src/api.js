"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require('serverless-http');

// Import DB Connection
require("./config/db");

// create express app
const app = express();
const router = express.Router();

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
  .use('/.netlify/functions/api', router);  // path must route to lambda

// Import API route
const routes = require("./api/routes"); //importing route
routes(app);

module.exports = app;
module.exports.handler = serverless(app);
