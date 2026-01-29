const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingcontroller = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage});


router.route("/").get(wrapAsync(listingcontroller.index))
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingcontroller.createlisting),
);


// new route
router.get("/new", isLoggedIn, listingcontroller.newlistingform);

router.route("/:id").get(wrapAsync(listingcontroller.showlisting)).put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingcontroller.updatelisting),
).delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.deletelisting),
);


// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.editlisting),
);


module.exports = router;
