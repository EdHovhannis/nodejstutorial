const path = require('path');

module.exports.err404 = function (req, res, next) {
  res.status(404).render(path.resolve(__dirname, '..', 'views', '404'), {
    title: '404 not found',
  });
};
