"use strict";

const GenerateRecordHistory = (record, res) => {
  if (res) {
    record = record !== undefined ? record : {};
    const requestUser = res.locals.requestUser
      ? res.locals.requestUser
      : res.locals.requestClient;
    const type = res.locals.requestUser ? "USER" : "CLIENT";
    if (record.created_by) {
      record.updated_at = Date.now();
    } else {
      record.created_at = Date.now();
    }
  }
  return record;
};

module.exports = {
  ResponseConstructor: require("./response-constructor"),
  ErrorTemplate: require("./error-template"),
  GenerateRecordHistory: GenerateRecordHistory,
};
