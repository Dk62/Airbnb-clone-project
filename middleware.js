module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("error", "You must be signed in first!");
      return res.redirect("/login");
    }
    next();
  };

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
      res.locals.redirectUrl = req.session.returnTo;
    }
    next();
  
    };