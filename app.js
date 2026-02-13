if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Ensure required environment variables are set
if (!process.env.SECRET) {
    throw new Error("SECRET environment variable is not set in .env file");
}
if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set in .env file");
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL;
main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// create a store that's compatible with multiple connect-mongo exports
let store;
const CM = MongoStore;

// Ensure secret is defined and not empty
const sessionSecret = process.env.SECRET;
if (!sessionSecret || sessionSecret.trim() === "") {
    throw new Error("SESSION SECRET must be a non-empty string");
}

if (CM && typeof CM.create === "function") {
    store = CM.create({
        mongoUrl: MONGO_URL,
        crypto: { 
            secret: sessionSecret 
        },
        touchAfter: 24 * 60 * 60
    });
} else if (typeof CM === "function") {
    // older API: require('connect-mongo')(session)
    const MongoStoreOld = CM(session);
    store = new MongoStoreOld({
        mongooseConnection: mongoose.connection,
        touchAfter: 24 * 60 * 60
    });
} else if (CM && CM.default && typeof CM.default.create === "function") {
    store = CM.default.create({
        mongoUrl: MONGO_URL,
        crypto: { 
            secret: sessionSecret 
        },
        touchAfter: 24 * 60 * 60
    });
} else {
    throw new Error("connect-mongo: unsupported export");
}

store.on("error", (err) => {
    console.error("Error in Mongo session store:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});





app.use("/listings",listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/users", userRouter);



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