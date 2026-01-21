const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controllers/users.js");

router.get("/signup", usercontroller.renderSignup);

router.post("/signup", wrapAsync(usercontroller.signup));

router.get("/login", usercontroller.renderLogin);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/users/login",
}),usercontroller.login);

router.get("/logout", usercontroller.logout);

module.exports = router;