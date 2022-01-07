"use strict";

const app = require("./app");
const awsSlsExpress = require("aws-serverless-express");
const sls = awsSlsExpress.createServer(app);

module.exports.handler = (event, context) =>
  awsSlsExpress.proxy(sls, event, context);
