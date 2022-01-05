'use strict';

const GenerateRecordHistory = (record, res) => {
  if (res) {
    record = record !== undefined ? record : {};
    const requestUser = res.locals.requestUser ? res.locals.requestUser : res.locals.requestClient;
    const type = res.locals.requestUser ? 'USER' : 'CLIENT';
    if (record.created_by) {
      record.updated_at = Date.now();
      record.updated_by = requestUser !== undefined ? requestUser._id : null;
      record.updated_by_type = type !== undefined ? type : null;
    } else {
      record.created_at = Date.now();
      record.created_by = requestUser !== undefined ? requestUser._id : null;
      record.created_by_type = type !== undefined ? type : null;
    }
  }
  return record;
}

module.exports = {
  ResponseConstructor: require('./response-constructor'),
  ErrorTemplate: require('./error-template'),
  GenerateRecordHistory: GenerateRecordHistory
};
