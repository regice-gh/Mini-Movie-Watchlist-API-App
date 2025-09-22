// Legacy middleware shim — prefer using `ensureAuthenticated` from js/auth.js
exports.checkLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  // For non-API flows redirect to login page
  return res.redirect('/login.html');
};

exports.bypassLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) return next();
  return res.redirect('/index.html');
};
