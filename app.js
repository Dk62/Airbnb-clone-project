const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodoverride= require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js")
const review = require("./models/review.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("hii, i am root");
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// index route 
app.get("/listings",wrapAsync( async (req, res) => {
    try {
        const allListings = await listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
}));
// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
});

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const foundListing = await listing.findById(id).populate("review");
    if (!foundListing) {
        throw new ExpressError(404, "Listing Not Found!");
    }
    res.render("listings/show", { listing: foundListing });
}));
//CREATE ROUTE

app.post("/listings", validateListing,
    wrapAsync(async(req, res, next) => {
    listingSchema.validate(req.body);
    const newListing=  new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));
// edit route
app.get("/listings/:id/edit",wrapAsync( async(req, res) => {
     let { id } = req.params;
        const Listing = await listing.findById(id);
        res.render("listings/edit.ejs",{listing:Listing});
}));
// update route
app.put("/listings/:id", validateListing,
    wrapAsync( async (req, res) => {
    let { id } = req.params;
   await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync( async (req, res ) => {
      let { id } = req.params;
      let deletedListing = await listing.findByIdAndDelete(id);
      console.log(deletedListing);
      res.redirect("/listings");
}));

// Reviews
//post route
app.post("/listings/:id/review",validateReview, wrapAsync(async(req, res) => {
     let foundListing = await listing.findById(req.params.id);
     let newReview = new review(req.body.review);

     foundListing.review.push(newReview);

     await newReview.save();
     await foundListing.save();

     res.redirect(`/listings/${foundListing._id}`);
}));

// delete review route
app.delete("/listings/:id/review/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);    
}));


// app.get("/testListing", async (req, res) => {
//     let samplelisting = new listing ({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "calaggute , Goa",
//         country: "india",
//
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
//
// })

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
     let { statusCode=500, message="something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
//    res.status(statusCode).send(message);
});

app.listen(8080, () =>{
    console.log("server is listining to port 8080");
});