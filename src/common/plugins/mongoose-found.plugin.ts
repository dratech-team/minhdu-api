module.exports = function plugin(schema) {
  schema.post('findOne', function (res, next) {
    if (!res) {
      return next(new Error('not found!'));
    }
    return next();
  });
};