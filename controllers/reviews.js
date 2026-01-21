const listing = require("../models/listing.js");
const review = require("../models/review.js");


module.exports.postreviews = async(req, res) => {
     let foundListing = await listing.findById(req.params.id);
     let newReview = new review(req.body.review);
     newReview.author = req.user._id;

     foundListing.review.push(newReview);

     await newReview.save();
     await foundListing.save();
     req.flash("success", "Successfully created new review!");
     res.redirect(`/listings/${foundListing._id}`);
};

module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/listings/${id}`);    
};