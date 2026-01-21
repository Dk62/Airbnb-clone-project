const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const review = require("../models/review.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isReviewOwner} = require("../middleware.js");

const reviewcontroller = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Reviews
//post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewcontroller.postreviews));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewOwner, wrapAsync(reviewcontroller.deleteReview));

module.exports = router;