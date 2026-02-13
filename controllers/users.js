const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    } 
   req.flash("success", "Welcome to Wanderlust!");
   res.redirect("/listings");
  });
  
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/users/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to wonderlust!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};
