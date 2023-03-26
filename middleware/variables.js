module.exports = function (req, res, next) {
  res.locals.isLoggined = req.session.isAuthenticated;
  res.locals.csrf = req.csrfToken();
  next();
};
