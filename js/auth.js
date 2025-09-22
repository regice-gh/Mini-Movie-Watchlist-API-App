// Middleware to ensure a request is authenticated via session.userId
function ensureAuthenticated(req, res, next) {
  try {
    if (req.session && req.session.userId) return next();
    // If the client accepts HTML, redirect to login page (browser flows)
    if (req.accepts && req.accepts('html')) {
      return res.redirect('/login.html');
    }
    // Otherwise (API clients) return 401 JSON
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { ensureAuthenticated };
