"use strict";

const server = require("./server");
const awsSlsExpress = require("aws-serverless-express");
const sls = awsSlsExpress.createServer(server);

module.exports.handler = (event, context) =>
  awsSlsExpress.proxy(sls, event, context);
