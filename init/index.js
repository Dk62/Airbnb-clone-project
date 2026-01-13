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

   await listing.deleteMany({});
   let modifiedData = data.map((obj) => ({...obj, owner: "68b42259d95439c4dc701722"}));
   await listing.insertMany(modifiedData);
   console.log("data was initialised");

};
initDB();

