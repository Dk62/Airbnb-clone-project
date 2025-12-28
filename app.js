const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const review = require("./routes/review.js");


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



app.use("/listings",listings);
app.use("/listings/:id/review", review);



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