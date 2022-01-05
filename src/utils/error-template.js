'use strict';

const ResponseConstructor = require('./response-constructor');

const errorResponse = (res, error, req, moreInfo) => {
  const status = error.status !== undefined ? error.status : 500;

  return ResponseConstructor(res, req, status, error.message, null, moreInfo);
}

const accessDenied = (req, res) => {
  const err = new Error('Permission denied. Credentials do not have access rights to this API.');

  err.status = 403;
  return errorResponse(res, err, req);
}

const wrongEndpoint = (req, res) => {
  const err = new Error(`Endpoint ${req.originalUrl} is invalid.`);

  err.status = 404;
  return errorResponse(res, err, req);
}

module.exports = {
  accessDenied,
  wrongEndpoint,
  errorResponse
}
