"use strict";

require("dotenv").config();
const http = require("http");
const server = require("./src/server");
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;

// start server on the specified port and binding host
http
  .createServer(server)
  .listen(port, host, () => console.info(`server starting on ${host}:${port}`));
