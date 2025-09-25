const mongoose = require('mongoose');
const{ data }= require('./data');
const listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
    initDB();
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async  () => {
    try{
   await listing.deleteMany({});
   await listing.insertMany(data);
   console.log("data was initialised");
}catch(err) {
    console.log("error initialising data: ", err);
}
};


