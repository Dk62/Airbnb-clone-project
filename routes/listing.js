const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
// index route 
router.get("/",wrapAsync( async (req, res) => {
    try {
        const allListings = await listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
}));
// new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const foundListing = await listing.findById(id).populate("review");
    if (!foundListing) {
        throw new ExpressError(404, "Listing Not Found!");
    }
    res.render("listings/show", { listing: foundListing });
}));
//CREATE ROUTE

router.post("/", validateListing,
    wrapAsync(async(req, res, next) => {
    listingSchema.validate(req.body);
    const newListing=  new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
// edit route
router.get("/:id/edit",wrapAsync( async(req, res) => {
     let { id } = req.params;
        const Listing = await listing.findById(id);
        res.render("listings/edit.ejs",{listing:Listing});
}));
// update route
router.put("/:id", validateListing,
    wrapAsync( async (req, res) => {
    let { id } = req.params;
   await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync( async (req, res ) => {
      let { id } = req.params;
      let deletedListing = await listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
}));

module.exports = router;