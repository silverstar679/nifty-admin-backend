"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// Import DB Connection
require("./config/db");

// create express app
const app = express();

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
  .use(awsServerlessExpressMiddleware.eventContext())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json()); // support json encoded bodies

// Import API route
const routes = require("./api/routes/dropRoutes"); //importing route
routes(app);

module.exports = app;
