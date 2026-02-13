const listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
      const q = req.query.q;
      let allListings;
      if (q && q.trim().length > 0) {
        const escapeRegex = (text) => {
          return text.replace(/[-\\/\\^$*+?.()|[\]{}]/g, "\\$&");
        };
        const regex = new RegExp(escapeRegex(q), "i");
        allListings = await listing.find({ $or: [{ location: regex }, { title: regex }] });
      } else {
        allListings = await listing.find({});
      }
      res.render("listings/index.ejs", { allListings, q });
  };

module.exports.newlistingform =(req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const foundListing = await listing
      .findById(id)
      .populate({ path: "review", populate: { path: "author" } })
      .populate("owner");
    if (!foundListing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing: foundListing });
  };

module.exports.createlisting = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  };

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
    req.flash("error", "listing you requested cannot be found!");
    res.redirect("/listings");
    }
    let originalImageUrl = Listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing: Listing, originalImageUrl});
  };

module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;

    await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      await listing.findByIdAndUpdate(id, { image: { url, filename } });
    }
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);
  };

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
  };