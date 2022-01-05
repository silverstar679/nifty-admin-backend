"use strict";

const authorize = async (req, cb) => {
  let token = req.headers["authorization"] || req.headers["Authorization"];

  if (token) {
    const splitToken = token.split(" ");

    if (splitToken.length === 2 && splitToken[0] === "Bearer")
      token = splitToken[1];
  } else token = req.query.token;

  if (token && token.constructor === String) {
    try {
      return cb(null, token === process.env.SECRET);
    } catch (e) {
      if (e.message === "jwt expired") {
        e.message = "Bearer token is expired.";
        e.status = 401;
        return cb(e);
      }
      return cb(e);
    }
  }
  const err = new Error("Missing/invalid Authorization header.");

  err.status = 401;
  return cb(err);
};

module.exports = authorize;
