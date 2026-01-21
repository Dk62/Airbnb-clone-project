const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { populate } = require("../models/review.js");

const listingcontroller = require("../controllers/listings.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// index route
router.get("/", wrapAsync(listingcontroller.index));
// new route
router.get("/new", isLoggedIn, listingcontroller.newlistingform);

// show route
router.get("/:id", wrapAsync(listingcontroller.showlisting));
//CREATE ROUTE

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingcontroller.createlisting),
);

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.editlisting),
);
// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingcontroller.updatelisting),
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.deletelisting),
);

module.exports = router;
