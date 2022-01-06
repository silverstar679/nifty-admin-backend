"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");
const path = require("path");
const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const { ErrorTemplate } = require("./utils");
const { wrongEndpoint } = ErrorTemplate;
const { DATABASE_URL } = process.env;

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.error(err));

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
// create express server
const server = express();
//use morgan to log at command line
if (config.util.getEnv("NODE_ENV") !== "test") {
  server.use(morgan("combined"));
}

server
  .use(cors())
  .use((req, res, next) => {
    res
      .header("Access-Control-Allow-Origin", "*")
      .header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
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
  .use(bodyParser.json()) // support json encoded bodies
  .use(express.static(path.resolve(__dirname + "/../public")))

  /**
   * Routing
   */
  .use("/v2", require("./v2"))
  .get("*", (req, res, next) => wrongEndpoint(req, res));

module.exports = server;
