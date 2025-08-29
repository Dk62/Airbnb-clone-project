const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");


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

app.get("/", (req,res) => {
    res.send("hii, i am root");
});

app.get("/testListing", async (req, res) => {
    let samplelisting = new listing ({
        title: "My new villa",
        description: "By the beach",
        price: 1200,
        location: "calaggute , Goa",
        country: "india",

    });
    await samplelisting.save();
    console.log("sample was saved");
    res.send("successful testing");

})

app.listen(8080, () =>{
    console.log("server is listining to port 8080");
})